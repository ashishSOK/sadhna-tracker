import mongoose from 'mongoose';

const sadhnaEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true
    },
    wakeUpTime: {
        type: String,
        required: [true, 'Wake up time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    sleepTime: {
        type: String,
        required: [true, 'Sleep time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    roundsChanted: {
        type: Number,
        required: [true, 'Number of rounds is required'],
        min: [0, 'Rounds cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Rounds must be a whole number'
        }
    },
    bookName: {
        type: String,
        required: [true, 'Book name is required'],
        enum: {
            values: ['Sb', 'Bg', 'CC', 'NOD', 'NOI', 'Other'],
            message: '{VALUE} is not a valid book name'
        },
        default: 'Sb'
    },
    readingDuration: {
        type: Number,
        required: [true, 'Reading duration is required'],
        min: [0, 'Reading duration cannot be negative'],
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 1440; // Max 24 hours in minutes
            },
            message: 'Reading duration must be between 0 and 1440 minutes'
        }
    },
    serviceDuration: {
        type: Number,
        required: [true, 'Service duration is required'],
        min: [0, 'Service duration cannot be negative'],
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 24; // Max 24 hours
            },
            message: 'Service duration must be between 0 and 24 hours'
        }
    },
    serviceType: {
        type: String,
        default: '',
        trim: true,
        maxlength: [100, 'Service type cannot exceed 100 characters']
    },
    hearingDuration: {
        type: Number,
        required: [true, 'Hearing duration is required'],
        min: [0, 'Hearing duration cannot be negative'],
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 24; // Max 24 hours
            },
            message: 'Hearing duration must be between 0 and 24 hours'
        }
    },
    // Score calculation for weekly winner
    totalScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index to ensure one entry per user per day
sadhnaEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate total score before saving
sadhnaEntrySchema.pre('save', function (next) {
    // Scoring algorithm
    this.totalScore =
        (this.roundsChanted * 10) +           // 10 points per round
        (this.readingDuration * 0.5) +        // 0.5 points per minute of reading
        (this.serviceDuration * 20) +         // 20 points per hour of service
        (this.hearingDuration * 15) +         // 15 points per hour of hearing
        (this.wakeUpTime <= '04:00' ? 50 : 0); // Bonus 50 points for waking before 4 AM

    next();
});

const SadhnaEntry = mongoose.model('SadhnaEntry', sadhnaEntrySchema);

export default SadhnaEntry;
