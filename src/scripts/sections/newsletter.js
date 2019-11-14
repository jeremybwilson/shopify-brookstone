/*============================================================================
  Footer Newsletter
==============================================================================*/

theme.Newsletter = (function() {
  function Newsletter(container) {
    const $container = this.$container = $(container);
    const ui = {
           formId: $( '#footer-newsletter' ),
          textbox: $( '#email' ),
           submit: $( '#button-footer-newsletter-submit' ),
         errorMsg: $( '#newsletter-error-response'),
       successMsg: $( '#newsletter-success-response')
    };

    // regex for valid email

    const regexEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

    if ( ui.formId ) {

      ui.textbox.on('focus', () => {

        // remove any pre-existing error class

        ui.formId.removeClass('has-error');
        ui.errorMsg.fadeOut();

      });

      // submit form

      ui.formId.submit( (e) => {
        e.preventDefault();

        // validation code

        let validEmail = regexEmail.test(ui.textbox.val());

        if(!validEmail) {

          // error state

          ui.formId.addClass('has-error');
          ui.errorMsg.fadeIn();

        } else {

          // success state

          if ( typeof zaius !== 'undefined' ) {
            zaius.subscribe({
                list_id: 'newsletter',
                email: ui.textbox.val()
              },

              // success state
              function () {
                ui.formId.fadeOut(() => {
                  ui.successMsg.fadeIn();
                });
              },

              // fail state
              function (error) {
                console.log(error);
              }
            );
          }
          
        }
      });
    }
  }
  Newsletter.prototype = _.assignIn({}, Newsletter.prototype, {});
  return Newsletter;
})();
