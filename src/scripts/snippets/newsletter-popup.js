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
});