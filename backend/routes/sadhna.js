import express from 'express';
import {
    createOrUpdateEntry,
    getMyEntries,
    getDevoteesEntries,
    getWeeklyWinner,
    deleteEntry,
    getMissingSubmissions
} from '../controllers/sadhnaController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { sadhnaEntryValidation } from '../utils/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for all authenticated users
router.post('/', sadhnaEntryValidation, createOrUpdateEntry);
router.get('/my-entries', getMyEntries);
router.delete('/:id', deleteEntry);

// Routes for mentors only
router.get('/devotees-entries', authorizeRoles('mentor'), getDevoteesEntries);
router.get('/weekly-winner', authorizeRoles('mentor'), getWeeklyWinner);
router.get('/missing-submissions', authorizeRoles('mentor'), getMissingSubmissions);

export default router;
