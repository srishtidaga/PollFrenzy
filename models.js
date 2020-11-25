const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/modeltest',{useNewUrlParser: true})

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('Db connected');
    const kittyschema = new mongoose.Schema({
        name : String
    });
    kittyschema.methods.speak = function () {
        const greeting = this.name
          ? "Meow name is " + this.name
          : "I don't have a name";
        console.log(greeting);
      }

    const kitten = mongoose.model('kitten',kittyschema);
    // const silence = new kitten({name: 'silence'});
    // console.log(silence.name);
    // silence.save(function(err,silence){
    //     if(err)
    //         return console.error(err);
    //     silence.speak();
    // });
    // var callback;
    itten.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
      });
    // kitten.find({ name: /^sil/ }, callback);
    // console.log(callback);
});