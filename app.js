const express = require('express');
const session = require('express-session');
const flash = require('connect-flash')
const bodyparser = require('body-parser');
const multer = require('multer');
const upload = multer();
const model = require('./models_1');
const url = require('url');
const { type } = require('os');

const port = 9990;
app = express();
app.set('view engine','ejs');
app.use(express.static('Public'));
app.use(bodyparser.json());
// for parsing application/xwww-
app.use(bodyparser.urlencoded({ extended: true })); 
//form-urlencoded
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(session({
    secret:'1343fedfsd@#$#@',
    saveUninitialized:true,
    resave:true
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

app.get('/test',(req,res)=>{
    console.log('print');
    res.render('test',{name:'raj'});
});

app.get("/contact",(req,res)=>{
res.render("contact")
})
app.get("/about",(req,res)=>{
res.render("about")
});

app.get("/home",(req,res)=>{
    if(req.session.user_id){
        return res.render("home",{'is_logged_in':true,'type':req.session.type});
    }else
        res.render("home",{'is_logged_in':false,'type':null});

});
app.get("/",(req,res)=>{
    res.redirect('home');
});

app.get("/registration",(req,res)=>{
    res.render("registration",{
        'name':undefined
    });
});

app.post('/client_registration',(req,res) => {
    console.log(req.body);
    var form_data = req.body;
    if(form_data.client_psw != form_data.client_rpsw){
        req.flash('error','Password won\'t match');
        return res.redirect('/registration',{
            'name':form_data.client_name
        });
    }

    if(form_data){
        const new_user = {
            'name':form_data.client_name,
            'client_email': form_data.client_email,
            'dob': form_data.client_dob,
            'mobile_no': form_data.client_mobile_no,
            'aadhar_no': form_data.client_aadharname,
            'address': form_data.client_address,
            'password': form_data.client_psw,
        };

        var is_email_exist = model.check_email_exist({ 'user_email': new_user.client_email });
        is_email_exist.then(resolve =>{
            console.log('working');
            if(resolve){
                req.flash('error','Account with this email already exist');
                return res.redirect('/registration');
            }else{
                var result = model.create_new_client(new_user);
                result.then(resolve=>{
                    req.session.user_id = resolve['_id'];
                    req.session.user_email = resolve['client_email'];
                    res.send('Client Account Created');
                    return res.redirect('/home');
                }).catch(err=>{
                    console.log('Error occured ',err);
                    req.flash('error','Some Error Occurred,try again later!!');
                    return res.redirect('/registration');
                });
            }
        }).catch(error =>{
            console.log('Error occured',error.message);
            req.flash('error','Some Error Occurred,try again later!!');
            return res.redirect('/registration');
        });
    }
});

app.get("/gallery",(req,res)=>{
    res.render("gallery")
});

app.get("/login",(req,res)=>{
    if(req.session.user_id){
        console.log(`${req.session.user_id},${req.session.user_email}`)
        res.redirect('/home');
    }else{
        res.render("login");
    }
});

app.post("/login",(req,res)=>{
    if(req.body){
        var form_data = req.body;
        const coming_user = {
            'email':form_data.uname,
            'password': form_data.psw
        };
        var result = model.check_user_credentials(coming_user);
        result.then(resolve=>{
            if(resolve){
                console.log(`${resolve['_id']},${resolve['user_email']}`);
                req.session.user_id = resolve['_id'];
                req.session.user_email = resolve['user_email'];
                req.session.type = 'user';
                return res.redirect('/home');
            }else{
                req.flash('error','Account does not exist');
                return res.redirect('/login');
            }
        }).catch(err=>{
            console.log('Error occured ',err);
            req.flash('error','Some Error Occurred,try again later!!');
            return res.redirect('/login');
        });
    }
});

app.get("/client_login",(req,res)=>{
    if(req.session.user_id){
        console.log(`${req.session.user_id},${req.session.user_email}`)
        res.redirect('/home');
    }else{
        res.render("regislogin");
    }
});

app.post("/client_login",(req,res)=>{
    if(req.body){
        var form_data = req.body;
        const coming_user = {
            'email':form_data.uname,
            'password': form_data.psw
        };
        var client_result = model.check_client_credentials(coming_user);
        client_result.then(resolve=>{
            if(resolve){
                console.log(`${resolve['_id']},${resolve['client_email']}`);
                req.session.user_id = resolve['_id'];
                req.session.user_email = resolve['client_email'];
                req.session.type = 'client';
                return res.redirect('/home');
            }else{
                req.flash('error','Account does not exist');
                return res.redirect('/client_login');
            }
        }).catch(err=>{
            console.log('Error occured ',err);
            req.flash('error','Some Error Occurred,try again later!!');
            return res.redirect('/client_login');
        });
    }
});

app.get('/logout',(req,res)=>{
    console.log('user was ',req.session.user_id);
    if(req.session.user_id){
        req.session.destroy(function(error){
            console.log('Error occurred',error);
        });
        res.redirect('/home');
    }else
        res.redirect('/home');
});

app.get("/signup",(req,res)=>{
    console.log(req.body);
    console.log(model);
    res.render("signup");
});

app.post("/signup",(req,res)=>{
    console.log(req.body);
    var form_data = req.body;
    if(form_data.uspw != form_data.uspw_repeat){
        req.flash('error','Password won\'t match');
        return res.redirect('/signup');
    }
    if(form_data.email && form_data.uspw && form_data.uspw_repeat){
        const new_user = {
            'user_email':form_data.email,
            'user_pass': form_data.uspw 
        };

        var is_email_exist = model.check_email_exist({ 'user_email': new_user.user_email });
        is_email_exist.then(resolve =>{
            console.log('working');
            if(resolve){
                req.flash('error','Account with this email already exist');
                return res.redirect('/signup');
            }else{
                var result = model.create_new_user(new_user);
                result.then(resolve=>{
                    req.session.user_id = resolve['_id'];
                    req.session.user_email = resolve['user_email'];
                    res.send('User Account Created');
                    return res.redirect('/home');
                }).catch(err=>{
                    console.log('Error occured ',err);
                    req.flash('error','Some Error Occurred,try again later!!');
                    return res.redirect('/signup');
                });
            }
        }).catch(error =>{
            console.log('Error occured',error.message);
            req.flash('error','Some Error Occurred,try again later!!');
            return res.redirect('/signup');
        });
    }
});

app.get("/faq",(req,res)=>{
    res.render("faq")
})
app.get("/regislogin",(req,res)=>{
    res.render("regislogin")
})
app.get("/team",(req,res)=>{
    res.render("team")
})
app.get("/ticketbook",(req,res)=>{
    if(req.session.user_id){
        var query_obj = url.parse(req.url,true).query;
        if(query_obj.event_id){
            console.log(query_obj);
            model.event_details.findOne({'_id':query_obj.event_id,},
            function(err, this_event_detail){
                if(!err && this_event_detail){
                    var start_date = this_event_detail.start_date;
                    var d = new Date();
                    console.log(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`);
                    console.log(start_date);
                    res.render("ticketbook",{
                        'name':this_event_detail.name,
                        'this_event_id' :this_event_detail.id,
                        'start_date':this_event_detail.start_date.toDateString(),
                        'end_date':this_event_detail.end_date.toDateString(),
                        'price':this_event_detail.ticket_price,
                        'start_end_time':this_event_detail.start_end_time,
                        'chief_guest':this_event_detail.chief_guest_names,
                        'current_date':`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
                    });
                }else if(err || this_event_detail){
                    res.render("ticketbook",{'this_event_id':undefined});
                }
            });
        }else{
            req.flash('error','Event ID not found');
            res.render("ticketbook",{'this_event_id':undefined});
        }
    }else{
        return res.redirect('/login');
    }
});

app.post("/ticketbook",(req,res)=>{
    if(req.session.user_id){
        var form_data = req.body;
        if(form_data){
            var new_ticket = {
                'event_id':form_data.event_id,
                'user_id':req.session.user_id,
                'no_of_tickets':form_data.persons
            };
            var this_event = model.event_details.findOne({'_id':form_data.event_id,},function(err, this_event_detail){
                if(!err){
                    console.log(this_event_detail);
                    var total_amount = parseInt(new_ticket.no_of_tickets) * this_event_detail.ticket_price;
                    new_ticket['total_amount'] = total_amount;
                    var result = model.purchase_ticket(new_ticket);
                    result.then(resolve=>{
                        req.flash('success',`Your Ticket ID is ${resolve['id']}`);
                        return res.redirect(`/ticketbook?event_id=${new_ticket.event_id}`);
                    }).catch(err=>{
                        console.log('Error occured ',err);
                        req.flash('error','Some Error Occurred,try again later!!');
                        return res.redirect('/ticketbook');
                    });
                }
            });
        }
    }else{
        return res.redirect('/login');
    }
});

app.get("/upcoming",(req,res)=>{
    res.render("upcome")
})

app.get("/services",(req,res)=>{
    res.render("services")
})

app.get("/userfeedback",(req,res)=>{
    res.render("userfeedback")
});

app.post("/platform_feedback",(req,res)=>{
    console.log(req.body);
    var form_data = req.body;
    const new_platform_feedback = {
        'first_name':form_data.firstname,
        'last_name': form_data.lastname,
        'mail_id':  form_data.mailid,
        'country': form_data.country,
        'feedback':form_data.feeedback,
    };
    var result = model.create_platform_feedback(new_platform_feedback);
    result.then(resolve=>{
        res.send('Thank You for your feedback')
    }).catch(err=>{
        console.log('Error occured ',err);
        req.flash('error','Some Error Occurred,try again later!!');
        return res.redirect('/signup');
    });

});

app.get("/happyclients",(req,res)=>{
    res.render("happyclients")
})

app.get('/create_event',(req,res)=>{
    if(req.session.user_id){
        res.render('create_event.ejs');
    }else{
        return res.redirect('/client_login');
    }
});

app.post('/create_event',(req,res)=>{
    if(req.session.user_id){
        console.log(req.body);
        var form_data = req.body;
    
        const new_event = {
            'name':form_data.event_name,
            'client_id': req.session.user_id,
            'type':  form_data.type,
            'min_allowed_age': form_data.min_age,
            'start_date':form_data.start_date,
            'end_date':form_data.end_date,
            'start_end_time':form_data.start_end_time,
            'chief_guest_names':form_data.chief_guest,
            'ticket_price':form_data.ticket_price,
            'total_capacity':form_data.total_capacity,
            'venue':form_data.venue
        };
    
        var result = model.create_event(new_event);
        result.then(resolve=>{
            res.send('Event Created Successfully!!');
        }).catch(err=>{
            console.log('Error occured ',err);
            req.flash('error','Some Error Occurred,try again later!!');
            return res.redirect('/create_event');
        });
    }else{
        return res.redirect('/client_login');
    }

});
app.get('/event',(req,res)=>{
    res.render('event.ejs');
});

app.get('/upcoming/events/:event_type',(req,res)=>{
    // res.send(`${req.params.event_type}`);
    var all_events = model.get_all_upcoming_events({
        'type': req.params.event_type});

        all_events.then(result=>{
        console.log(result);
        res.render('event',{'all_events':result})
    }).catch(err=>{
        console.log('Error occured ',err);
        req.flash('error','Some Error Occurred,try again later!!');
        return res.redirect(`/upcoming/events/${req.params.event_type}`);
    });
    // res.render('event.ejs');
});

app.listen(port,()=>{
    console.log("Connected")
})
