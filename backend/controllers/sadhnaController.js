import SadhnaEntry from '../models/SadhnaEntry.js';
import User from '../models/User.js';
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

// @desc    Create or update sadhna entry
// @route   POST /api/sadhna
// @access  Private
export const createOrUpdateEntry = async (req, res) => {
    try {
        const {
            date,
            wakeUpTime,
            sleepTime,
            roundsChanted,
            bookName,
            readingDuration,
            serviceDuration,
            serviceType,
            hearingDuration
        } = req.body;

        const entryDate = startOfDay(new Date(date));

        // Check if entry already exists for this user and date
        let entry = await SadhnaEntry.findOne({
            userId: req.user._id,
            date: entryDate
        });

        if (entry) {
            // Update existing entry
            entry.wakeUpTime = wakeUpTime;
            entry.sleepTime = sleepTime;
            entry.roundsChanted = roundsChanted;
            entry.bookName = bookName;
            entry.readingDuration = readingDuration;
            entry.serviceDuration = serviceDuration;
            entry.serviceType = serviceType;
            entry.hearingDuration = hearingDuration;

            await entry.save();

            res.json({ message: 'Sadhna entry updated successfully', entry });
        } else {
            // Create new entry
            entry = await SadhnaEntry.create({
                userId: req.user._id,
                date: entryDate,
                wakeUpTime,
                sleepTime,
                roundsChanted,
                bookName,
                readingDuration,
                serviceDuration,
                serviceType,
                hearingDuration
            });

            res.status(201).json({ message: 'Sadhna entry created successfully', entry });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's sadhna entries
// @route   GET /api/sadhna/my-entries
// @access  Private
export const getMyEntries = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;

        let query = { userId: req.user._id };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const entries = await SadhnaEntry.find(query)
            .sort({ date: -1 })
            .limit(limit ? parseInt(limit) : 100);

        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all devotees' entries (for mentors)
// @route   GET /api/sadhna/devotees-entries
// @access  Private (Mentor only)
export const getDevoteesEntries = async (req, res) => {
    try {
        // Get all devotees under this mentor
        const devotees = await User.find({ mentorId: req.user._id });
        const devoteeIds = devotees.map(d => d._id);

        const { date } = req.query;
        let query = { userId: { $in: devoteeIds } };

        if (date) {
            const targetDate = startOfDay(new Date(date));
            query.date = targetDate;
        }

        const entries = await SadhnaEntry.find(query)
            .populate('userId', 'name email phone')
            .sort({ date: -1, totalScore: -1 });

        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get weekly winner
// @route   GET /api/sadhna/weekly-winner
// @access  Private (Mentor only)
export const getWeeklyWinner = async (req, res) => {
    try {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

        // Get all devotees under this mentor
        const devotees = await User.find({ mentorId: req.user._id });
        const devoteeIds = devotees.map(d => d._id);

        // Get all entries for this week
        const entries = await SadhnaEntry.find({
            userId: { $in: devoteeIds },
            date: { $gte: weekStart, $lte: weekEnd }
        }).populate('userId', 'name email phone');

        // Calculate total scores for each devotee
        const scoreMap = {};
        entries.forEach(entry => {
            const userId = entry.userId._id.toString();
            if (!scoreMap[userId]) {
                scoreMap[userId] = {
                    user: entry.userId,
                    totalScore: 0,
                    entries: []
                };
            }
            scoreMap[userId].totalScore += entry.totalScore;
            scoreMap[userId].entries.push(entry);
        });

        // Convert to array and sort by score
        const rankings = Object.values(scoreMap).sort((a, b) => b.totalScore - a.totalScore);

        res.json({
            weekStart,
            weekEnd,
            rankings,
            winner: rankings.length > 0 ? rankings[0] : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete sadhna entry
// @route   DELETE /api/sadhna/:id
// @access  Private
export const deleteEntry = async (req, res) => {
    try {
        const entry = await SadhnaEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check if user owns this entry
        if (entry.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this entry' });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get devotees who haven't submitted today
// @route   GET /api/sadhna/missing-submissions
// @access  Private (Mentor only)
export const getMissingSubmissions = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());

        // Get all devotees under this mentor
        const devotees = await User.find({ mentorId: req.user._id, isActive: true });
        const devoteeIds = devotees.map(d => d._id);

        // Get all entries for target date
        const entries = await SadhnaEntry.find({
            userId: { $in: devoteeIds },
            date: targetDate
        });

        const submittedUserIds = entries.map(e => e.userId.toString());

        // Find devotees who haven't submitted
        const missingDevotees = devotees.filter(d =>
            !submittedUserIds.includes(d._id.toString())
        );

        res.json({
            date: targetDate,
            missingDevotees: missingDevotees.map(d => ({
                _id: d._id,
                name: d.name,
                email: d.email,
                phone: d.phone
            })),
            total: missingDevotees.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
