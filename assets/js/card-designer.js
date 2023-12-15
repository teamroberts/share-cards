const cardForm = document.getElementById("cardForm");

// update the preview when fields are edited
cardForm.addEventListener("input", function(e) {
    const editedFieldName = e.target.name;
    if(editedFieldName === "b") {
        // background is special
        document.getElementById("card").style.backgroundColor = e.target.value;
    } else {
        const previewTarget = document.getElementById(`card-${editedFieldName}`);
        if(previewTarget) {
            // put the typed value into the relevant slot on the card preview, or
            // use that slot's data-placeholder if the form field is empty.
            previewTarget.textContent = e.target.value || previewTarget.dataset.placeholder;
        }
    }
});

// generate URL when form is submitted
cardForm.addEventListener("submit", function(e) {
    e.preventDefault();
    // base URL to display (rather than design) this card
    const cardUrl = new URL("card/", document.location.href);
    // turn the form fields into an x-www-form-urlencoded query string
    const values = new URLSearchParams(new FormData(cardForm));
    // add query string as the URL hash, base64 encoded to make it look
    // like a random code rather than an obvious k1=v1&k2=v2 string.
    // In a real system there would instead be some sort of server side
    // that either (a) maintains its own database mapping parameters to
    // short codes or (b) passes the long URL to a public shortener API
    // like tiny.cc to generate a manageable share link
    cardUrl.hash = btoa(values.toString());

    // put the final link in the URL field
    const urlField = document.getElementById("cardUrl");
    urlField.value = cardUrl.toString();

    // and attempt to copy it to the clipboard
    urlField.select();
    const copyStatus = document.getElementById("copyStatus");
    if(document.execCommand("copy")) {
        // copy command was successful
        copyStatus.textContent = "Copied!";
    } else {
        // copy command not supported, so just say we've created the
        // link and let user copy it themselves
        copyStatus.textContent = "Link created!"
    }

    // Hide the status message after three seconds
    setTimeout(() => {
        // \u00A0 is the JavaScript notation for an HTML &nbsp;
        copyStatus.textContent = "\u00A0";
    }, 3000);
});