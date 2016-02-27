/**
 * Created by daniel on 11/01/16.
 */

/**
 * This script loads all the recaptcha widgets inside of the index page
 */

var recaptchaPWDRecoveryWidget;
var recaptchaSignUpWidget;
var sitekey = '6Lc6FRUTAAAAACAW9o1HRnMkY-x9Ek84UWsY9bPX';


var onloadRecaptchaCallback = function () {
    //console.log("grecaptcha is ready!");

    recaptchaPWDRecoveryWidget = grecaptcha.render('recaptchaPWDRecoveryWidget', {
        'sitekey' : sitekey,
        'theme' : 'light'
    });


    recaptchaSignUpWidget = grecaptcha.render('recaptchaSignUpWidget', {
        'sitekey' : sitekey,
        'theme' : 'light'
    });
};
