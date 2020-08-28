function validateContactForm() {
    let result = true;
    let email = $('#contact-email').val();
    let subject = $('#contact-Subject').val();
    let msg = $('#contact-message').val();
    toastr.success(email+subject+msg);

    if (email.length === 0) {
        toastr.warning('Empty email. Please fill it.');
        result = false;
    }
    if (subject.length === 0){
        toastr.warning('Empty subject. Please fill it.');
        result = false;
    }
    if (msg.length === 0){
        toastr.warning('Empty message. Please fill it.');
        result = false;
        }

    if (result) {
        toastr.success('Email was sent.');
        //$('#contact').trigger('reset');
    }
    else
        toastr.error('Email was not send.');
}