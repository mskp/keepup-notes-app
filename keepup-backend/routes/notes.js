const express = require('express');
const fetchUser = require('../middleware/fetcher');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');

router
    // Display notes
    .get('/', fetchUser, async (req, res) => {
        try {
            let notes = await Notes.find({ user: req.user.id }, null,  {sort: {date: -1}})
            return res.status(200).json(notes)
        } catch (err) {
            return res.status(500).json(err.message)
        }
    })

    // **create note
    .post('/',
        fetchUser,
        body('title').isLength({ min: 1, max: 70 }),
        body('description').isLength({ min: 1, max: 1000 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            try {
                let note = await Notes.create({
                    user: req.user.id,
                    ...req.body
                })
                res.status(200).json({ message: "Note created" });
            } catch (err) {
                return res.status(500).json(err.message);
            }
        })

    // **Update Note
    .put('/:id', fetchUser,
        body('title').isLength({ min: 1, max: 70}),
        body('description').isLength({ min: 1, max: 1000 }), async (req, res) => {
            try {
                let updatedNote = {
                    ...req.body
                }
                let note = await Notes.findById(req.params.id);
                if (!note) return res.status(404).json({ message: 'Note not found' });
                if (note.user.toString() !== req.user.id) res.status(401).json({ message: "Could not update" })
                note = await Notes.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true });
                return res.status(200).json({ note });


            } catch (err) {
                return res.status(500).json(err.message)
            }
        })

    // **Delete Note
    .delete('/:id', fetchUser, async (req, res) => {
        try {
            let note = await Notes.findById(req.params.id);
            if (!note) return res.status(404).json({ message: 'Note not found' });

            if (note.user.toString() !== req.user.id) res.status(401).json({ message: "Could not delete" })

            note = await Notes.findByIdAndDelete(req.params.id)
            return  res.status(200).json({ message: `Note with id ${note.id} got deleted` })
        } catch (err) {
            return res.status(500).json(err.message);
        }
    })

module.exports = router;