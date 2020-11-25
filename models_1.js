const mongoose = require('mongoose');
const schemas = require('./schemas');

mongoose.connect('mongodb://localhost/pollfrenzy',{useNewUrlParser: true});

const db = mongoose.connection;
const user_login = mongoose.model('user_login',schemas.user_login);
const client_login = mongoose.model('client_login',schemas.client_login);
const user_feedback = mongoose.model('user_feedback',schemas.user_feedback);
const event_details = mongoose.model('event_details',schemas.event_details);
const event_ticket = mongoose.model('event_ticket',schemas.event_tickets);
const platform_feedback = mongoose.model('platform_feedback',schemas.platform_feedback);


db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('Database opened');
    
// Create new event
// let x = create_event({
//     'name': "Tommy's show",
//     'client_id':'5fa9ed777fced227d0086653',
//     'type': "Singing event",
//     'min_allowed_age': '18',
//     'start_date': new Date(2020,12 ,31 , 21, 0, 0, 0),
//     'end_date': new Date(2021,1 ,5 , 23, 0, 0, 0),
//     'start_end_time': 'From 9AM to 12PM',
//     'chief_guest_names':'NObody',
//     'ticket_price':500,
//     'total_capacity':350,
//     'venue':'Near nowhere'
// });

    // let x = get_all_user_for_an_event({
    //     'event_id':'5fa9ed777fced227d0086653'
    // });
    // x.then(result =>{
    //     // console.log(result);
    // for (let i=0;i<result.length;i++) {
    //     console.log('Result is ',result[i]);
    //     }
    // }).catch(error =>{
    //     console.log('Error occured',error.message);
    // });
//     let x = check_email_exist({ 'user_email': 'joel@gmail.com' });
//     x.then(result =>{
//         console.log('Result is ',result);
//     }).catch(error =>{
//         console.log('Error occured',error.message);
// });
});

function get_all_user_for_an_event(event){
    return new Promise(async function(resolve,reject){
        event_ticket.find({'event_id': event['event_id']},function(err,all_events){
            if(err)
                reject(err);
            resolve(all_events);
        });
    });
}

function get_tickets_purchased_by_user(user){
    return new Promise(async function(resolve,reject){
        event_ticket.find({'user_id': user['user_id']},function(err,all_events){
            if(err)
                reject(err);
            resolve(all_events);
        });
    });
}

function get_all_events_of_client(event){
    return new Promise(async function(resolve,reject){
        event_details.find({'client_id': event['client_id']},function(err,all_events){
            if(err)
                reject(err);
            resolve(all_events);
        });
    });
}

function get_all_upcoming_events(event){
    return new Promise(async function(resolve,reject){
        event_details.find({type:event['type'] ,start_date: { $gt:Date.now()},},function(err,all_events){
            if(err)
                reject(err);
            resolve(all_events);
        });
    });
}

function get_all_feedbacks_for_event(event_id){
    return new Promise(async function(resolve,reject){
        user_feedback.find({'event_id': event_id['event_id']},function(err,feedbacks){
            if(err)
                reject(err);
            resolve(feedbacks);
        });
    });
}

function get_all_feedbacks_of_user(user_id){
    return new Promise(async function(resolve,reject){
        user_feedback.find({'user_id': user_id['user_id']},function(err,feedbacks){
            if(err)
                reject(err);
            resolve(feedbacks);
        });
    });
}

function create_event(event){
    return new Promise(async function(resolve,reject){
        const new_event = new event_details({
            'name': event['name'],
            'client_id':event['client_id'],
            'type': event['type'],
            'min_allowed_age': event['min_allowed_age'],
            'start_date':event['start_date'],
            'end_date': event['end_date'],
            'start_end_time': event['start_end_time'],
            'chief_guest_names':event['chief_guest_names'],
            'ticket_price':event['ticket_price'],
            'total_capacity':event['total_capacity'],
            'venue':event['venue']
        });
        await new_event.save(function(err,newevent){
            if(err)
                reject(err);
            resolve(newevent);
        });
    });
}

function check_user_credentials(user_cred){
    return new Promise(async function(resolve,reject){
        const query = user_login.where({
            'user_email': user_cred['email'],
            'user_pass': user_cred['password']
        });
        await query.findOne(function (err, existing_user) {
            if (err){
                // if error reject the promise
                reject(err);
            }
            // if it is okk then return the result ,whatever it is
            resolve(existing_user);
        });
    });
}

function check_client_credentials(user_cred){
    return new Promise(async function(resolve,reject){
        const query = client_login.where({
            'client_email': user_cred['email'],
            'password': user_cred['password']
        });
        await query.findOne(function (err, existing_user) {
            if (err){
                // if error reject the promise
                reject(err);
            }
            // if it is okk then return the result ,whatever it is
            resolve(existing_user);
        });
    });
}

function create_new_user(user_data){
    /**For creating new user data for new sign up for a normal user
     * @params `user_data` JS object containing user_email,user_pass,event_id,event_name,
        body,rating
     * return true or false
     * `true`:if user data inserted successfully
     * `false`:if user data does not inserted successfully
     */
    return new Promise(async function(resolve,reject){
        const new_user = new user_login({
            'user_email': user_data['user_email'],
            'user_pass': user_data['user_pass'],
        });
        await new_user.save(function(err,newuser){
            if(err)
                reject(err);
            resolve(newuser);
        });
    });
}

function create_new_client(client_data){
    /**For creating new client data for new sign up for a client that wants to organize the event
     * @params `client_data` JS object containing information
     * return true or false
     * `true`:if user data inserted successfully
     * `false`:if user data does not inserted successfully
     */
    return new Promise(async function(resolve,reject){
        const new_client = new client_login({
            'name': client_data['name'],
            'client_email': client_data['client_email'],
            'dob': client_data['dob'],
            'mobile_no': client_data['mobile_no'],
            'aadhar_no': client_data['aadhar_no'],
            'address': client_data['address'],
            'password': client_data['password'],
        });
        await new_client.save(function(err,newclient){
            if(err)
                reject(err);
            resolve(newclient);
        });
    });
}

function create_user_feedback(feedback){
    return new Promise(async function(resolve,reject){
        const new_feedback = new user_feedback({
            'user_id':feedback['user_id'],
            'event_id':feedback['event_id'],
            'body':feedback['body'],
            'rating':feedback['rating'],
            'date':Date.now()
        });
        await new_feedback.save(function(err,newfeedback){
            if(err)
                reject(err);
            resolve(newfeedback);
        });
    });
}

function create_platform_feedback(feedback){
    return new Promise(async function(resolve,reject){
        const new_feedback = new platform_feedback({
            'first_name':feedback['first_name'],
            'last_name':feedback['last_name'],
            'mail_id':feedback['mail_id'],
            'country':feedback['country'],
            'feedback':feedback['feedback'],
        });
        await new_feedback.save(function(err,newfeedback){
            if(err)
                reject(err);
            resolve(newfeedback);
        });
    });
}

function check_email_exist(user_data){
    /**For creating new user data for new sign up for a normal user
     * @params `user_data` JS object containing user_email,user_pass,event_id,event_name,
        body,rating
     * return true or false
     * `true`:if user data inserted successfully
     * `false`:if user data does not inserted successfully
     */
    return new Promise(async function(resolve,reject){
        if(user_data.hasOwnProperty('user_email') && user_data.user_email){
            const query_user = user_login.where({'user_email': user_data['user_email']});
            const query_client = client_login.where({'client_email': user_data['user_email']});
            var flag=false;
            await query_user.findOne(function (err, user) {
                if (err){
                    // if error reject the promise
                    reject(err);
                }
                // if it is okk then update flag and check in client too
                if(user){
                    resolve(true);
                }
            });
            if(!flag){
                await query_client.findOne(function (err, user) {
                    if (err){
                        // if error reject the promise
                        reject(err);
                    }
                    // if it is okk then return the result ,whatever it is
                    if(user){
                        resolve(true);
                    }
                    else{
                        resolve(false);
                    }
                });
            }
        }
        else
            reject(new Error('User email should not be null/undefined'));
    }) ;
}

function purchase_ticket(ticket){
    return new Promise(async function(resolve,reject){
        const new_ticket = new event_ticket({
            'event_id': ticket['event_id'],
            'user_id': ticket['user_id'],
            'no_of_tickets': ticket['no_of_tickets'],
            'total_amount': ticket['total_amount'],
        });
        console.log(ticket['no_of_tickets']);
        await new_ticket.save(function(err,newticket){
            if(err)
                reject(err);
            resolve(newticket);
        });
    });
}

module.exports = {
    user_login:user_login,
    create_event:create_event,
    event_details:event_details,
    purchase_ticket:purchase_ticket,
    create_new_user:create_new_user,
    check_email_exist:check_email_exist,
    create_new_client:create_new_client,
    create_user_feedback:create_user_feedback,
    check_user_credentials:check_user_credentials,
    get_all_upcoming_events:get_all_upcoming_events,
    create_platform_feedback:create_platform_feedback,
    check_client_credentials,check_client_credentials,
};