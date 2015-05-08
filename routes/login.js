module.exports = function(app, passport) 
{
     app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/subjects', 
        failureRedirect : '/login', 
        failureFlash : true,
    }));

    app.post('/', passport.authenticate('local-signup', {
        successRedirect : '/subjects', 
        failureRedirect : '/',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/subjects',
            failureRedirect : '/'
        }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}