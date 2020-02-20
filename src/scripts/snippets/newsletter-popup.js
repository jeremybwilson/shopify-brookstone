/*============================================================================
 Email Popup
==============================================================================*/
$(document).ready(function () {

    (function email_popup() {
        // SETUP : Config
        const emailPopupDelay = 5000; // in ms (5000 = 5s)

        // COOKIES : Check cookies (including GDPR)
        var check_popup_cookie = $.cookie('mailing_list_delay_popup');
        var check_banner_cookie = $.cookie('gdpr_banner_read');

        // by default, the cookie banner will popup first. once the user hits "accept", then load the newsletter.
        // the newsletter is set to popup again after 7 days. though the cookie banner has already been read,
        if (check_popup_cookie == null && check_banner_cookie != null) {
            setTimeout(function () {
                theme.utils.emailUtils.email_popup_load();
            }, emailPopupDelay );
        }

        const ui = {
            formId: $('#subscribe--popup--form'),
            textbox: $('#email-popup'),
            submit: $('#subscribe--popup--button'),
            errorMsg: $('#subscribe--popup--error-response'),
            successMsg: $('#subscribe--popup--success-response'),
            fadeOutGroup: $('#subscribe--popup--form, #subscribe--popup .fine-print')
        };

        const regexEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

        if (ui.formId) {
            ui.textbox.on('focus', () => {

                // Remove any pre-existing error class
                ui.formId.removeClass('has-error');
                ui.errorMsg.fadeOut();
            });

            // SUBMIT : Form submit action intercepter
            ui.formId.submit((e) => {
                e.preventDefault();

                // CHECK : Validate Email
                let validEmail = regexEmail.test(ui.textbox.val());

                // ERROR : Email invalid
                if (!validEmail) {
                    ui.formId.addClass('has-error');
                    ui.errorMsg.fadeIn();

                // SUCCESS : Send to zaius
                } else {

                    if ( typeof zaius !== 'undefined' ) {
                        zaius.subscribe(
                            {   
                                list_id: 'newsletter',
                                email: ui.textbox.val()
                            },
                            // ZAIUS : SUCCESS : Zaius call was successful
                            function () {
                                ui.fadeOutGroup.fadeOut(() => {
                                    ui.successMsg.fadeIn();
                                });
                            },

                            // ZAIUS : FAILED : Zaius call failed
                            function (error) {
                                console.log(error);
                            }
                        );
                    } else {
                        console.log('Error : [ Newsletter-Popup.js ] : Zaius is not installed, please install the app or refactor this to use the native submit.');
                    }
                }
            });
        }
    })();
    (function Newsletterpop() {
        var ui = {
            popup: $('#myModal-newsletter-pop'),
            formId: $('#newsletter--popup--form'),
            email: $('#newsletter--popup--form input#email'),
            close: $('#myModal-newsletter-pop .close'),
            success: $('.subscribe--popup--form-response'),
            error: $('.subscribe--popup--form-error'),
        };
        const cordialSettings = {
            'channels.email.subscribeStatus': 'subscribed',
            newsletter: true,
            welcome_email: true,
        }
        const cordialOptions = { upsert: true }

        var check_newsletter_pop = $.cookie('newsletter_pop');
        if (check_newsletter_pop == null) {
            if (!ui.popup.length > 0) {
                return false;
            }
            ui.popup.addClass('show-popup');
            ui.popup.fadeIn(200,'linear',function(){
                $.cookie('newsletter_pop', 'expires_seven_days', { expires: 7 });
            });
            ui.close.click(function() {
                ui.popup.removeClass('show-popup');
                $(this).closest('#myModal-newsletter-pop').fadeOut();
            });
        }
        
        const regexEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
        if (ui.formId) {
            ui.formId.submit((e) => {
                e.preventDefault();

                // CHECK : Validate Email
                let validEmail = regexEmail.test(ui.email.val());
                if (!validEmail) {
                    ui.error.removeClass('hide');
                } else {
                    ui.error.addClass('hide');
                    cordial.identify(ui.email.val())
                    cordial.contact(cordialSettings, cordialOptions)
                    cordial.event('subscribed', {'source': 'popup'})
                    ui.email.val('');
                    ui.success.removeClass('hide');
                }
            });         
        }
    })();
});