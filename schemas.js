const mongoose = require('mongoose');
const {Schema} = mongoose;

// user login/signup schema
const user_login = new Schema({
    'active':{
        type:Boolean,
        default:true
    },
    'type':{
        type:String,
        default:'user'
    },
    'user_email':{
        type:String,
        required:[true,'User email is required']
    },
    'user_pass':{
        type:String,
        minlength:8,
        required:[true,'User email is required']
    },
    'user_name':{
        type:String,
        default:function(){
            return this.user_name = this.user_email.split('@',1)[0];
        },
        required:true,
    }
});

const user_feedback = new Schema({
    'user_id':String,
    'event_id':String,
    'body':String,
    'rating':Number,
    'date':{
        type:Date,
        default:Date.now
    }
});
const platform_feedback = new Schema({
    'first_name':String,
    'last_name':String,
    'mail_id':String,
    'country':String,
    'feedback':String,
    'date':{
        type:Date,
        default:Date.now
    }
});
// customer login/signup
const client_login = new Schema({
    'name':{
        type:String,
        required:true,
    },
    'active':{
        type:Boolean,
        default:true,
    },
    'type':{
        type:String,
        default:'client'
    },
    'client_email':{
        type:String,
        required:true,
    },
    'dob':{
        type:Date,
        required:true,
    },
    'mobile_no':{
        type:String,
        minlength:10,
        maxlength:10,
        required:true
    },
    'aadhar_no':{
        type:String,
        minlength:12,
        maxlength:12,
        required:true
    },
    'address':{
        type:String,
        required:true,
    },
    'password':{
        type:String,
        minlength:8,
        required:true,
    },
    // 'feedbacks':[{
    //     'event_id':mongoose.Types.ObjectId,
    //     'event_name':String,
    //     'post':[{
    //         'body':Number,
    //         'rating':Number,
    //         'date':Date
    //     }]
    // }]
});

const event_details = new Schema({
    'active':{
        type:Boolean,
        default:true
    },
    'name':{
        type:String,
        required:true
    },
    'client_id':{
        type:String,
        required:true
    },
    'type':{
        type:String,
        required:true
    },
    'min_allowed_age':{
        type:Number,
        required:false
    },
    'create_date':{
        type:Date,
        default:Date.now
    },
    'start_date':{
        type:Date,
        required:true,
    },
    'end_date':{
        type:Date,
        required:true
    },
    'start_end_time':{
        type:String,
    },
    'chief_guest_names':{
        type:String,
    },
    'ticket_price':{
        type:Number,
        validate:[
            function(){ return this.ticket_price > 0; },
            'Ticket price can not be zero'
        ]
    },
    'total_capacity':{
        type:Number,
        validate:[
            function(){ return this.total_capacity > 0; },
            'Total Capacity can not be zero'
        ]
    },
    'venue':{
        type:String,
        required:[ true,'Venue must be present' ]
    }
});

const event_tickets = new Schema({
    'event_id':{
        type:String,
        required:true
    },
    'user_id':{
        type:String,
        required:true
    },
    'no_of_tickets':{
        type:Number,
        validate:[
            function(){ return this.no_of_tickets > 0; },
            'No of Tickets can not be less than zero'
        ]
    },
    'purchase_date':{
        type:Date,
        default:Date.now
    },
    'total_amount':{
        type:Number,
        validate:[
            function(){ return this.total_amount > 0; },
            'Total amount can not be less than zero'
        ]
    }
});

module.exports = {
    user_login:user_login,
    user_feedback:user_feedback,
    client_login:client_login,
    platform_feedback:platform_feedback,
    event_details:event_details,
    event_tickets:event_tickets
};