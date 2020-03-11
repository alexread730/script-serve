$(document).ready(function() {
  $('select').niceSelect();
});

window.onload = function() {
  $(document).off('submit');
  console.log('loaded boi!')
  var user_email = null;
  var localSession = null;

  var serializeForm = function(form) {
    var resultObject = {};

    form.serialize().split('&').forEach((field) => {
      field = field.split('=');
      resultObject[field[0]] = decodeURIComponent(field[1]);
    });

    return resultObject;
  }
  
  function getSession() {
    /*
    jQuery.ajax({
      url: "https://account.intrinio.com/session", 
      xhrFields: {withCredentials: true}
    }).done(function(session, status, xhr) {
      localSession = session;
      continueAccountCompletion();
    }).fail(function() {
      window.location.href = "https://intrinio.com/login"
    });
    */
    localSession = {
      "email": "alexread7323@gmail.com",
      "full_name": "Alexander Read",
      "last_four": null,
      "card_type": null,
      "stripe_subscription": null,
      "api_key": "d241545d2ecb82c0f85eea75b5c0a4c1",
      "subscription_valid_until": null,
      "user": {
        "id": 49863,
        "email": "alexread7323@gmail.com",
        "username": null,
        "first_name": "Alexander",
        "last_name": "Read",
        "billing_address": {
          "address_1": null,
          "address_2": null,
          "city": null,
          "state": null,
          "postal_code": null,
          "country": null
        },
        "has_api_v1_access": false,
        "token": null,
        "ab_group": "C",
        "has_prophet_access": false,
        "hubspot_profile": {
          "persona_vertical": "Business",
          "company": "",
          "website": "http://Testsubmit.net",
          "do_we_have_the_solution_you_need_": "Real-Time Prices;Unique Datasets (Alternative, Research, Sentiment, etc);",
          "are_you_the_decision_maker_": "Yes",
          "where_are_you_in_the_decision_making_process_": "Initial discovery phase",
          "do_you_have_a_budget_in_mind_": "Yes"
        }
      }
    }
    continueAccountCompletion();
  }
  
  function continueAccountCompletion() {
    user_email = localSession.email;
    
    jQuery.ajax({
      method: "GET",
      url: "https://account.intrinio.com/hubspot/get_user",
      data: {"email": user_email}
    }).done(function(session, status, xhr) {
    	//set form fields with HubSpot profile values
      document.querySelector('input[data-name="first name"]').value = session["first_name"];
      document.querySelector('input[data-name="last name"]').value = session["last_name"];
      document.querySelector('input[data-name="business name"]').value = session["business_name"];
      document.querySelector('input[data-name="business url"]').value = session["business_url"];
      document.querySelector('textarea[data-name="tell us more"]').value = session["tell_us_more"];

      session["selected_solutions"].split(';').forEach((solution) => {
        $(document.querySelector(`input[data-solution="${solution}"]`)).click();
      })

      if (session["Business_or_personal"]) {
        $(document.querySelector(`input[data-name="Business or personal?"][value=${session["Business_or_personal"]}`).previousSibling).click();
        $(document.querySelector(`input[data-name="Business or personal?"][value=${session["Business_or_personal"]}`).previousSibling).click();
      }

      $(document.querySelector(`li[data-value="${session["details_project_phase"]}"`)).click();
      $(document.querySelector(`li[data-value="${session["details_timeline"]}"`)).click();
      $(document.querySelector('select[name="details-decision-maker"]').nextSibling.querySelector(`li[data-value="${session["details_decision_maker"]}"`)).click();
      $(document.querySelector('select[name="details-budget"]').nextSibling.querySelector(`li[data-value="${session["details_budget"]}"`)).click();
    }).fail(function() {
    });

    var nextButton = document.querySelector('.signup-slide-next');
    var backButton = document.querySelector('.signup-go-back');
    var submitButton = document.querySelector('.signup-slide-finish');
    var signupNav = document.querySelector('.signup-nav');
    var signupNavDots = Array.prototype.slice.call(signupNav.children);

    const urlParams = new URLSearchParams(window.location.search);
    var currentStep = urlParams.get('signup-step');

    if (currentStep) {
      $(signupNav.children[currentStep-1]).click();
    } else {
      var currentStep = 2;
      urlParams.set('signup-step', currentStep);
    }

    nextButton.onclick = function() {
      document.querySelectorAll('.error-field-missing').forEach((error) => error.style.display = "none");
      var formFields = serializeForm($('form'));
      var personaValue = null;

      if (currentStep == 2) {
        var checkedPersona = document.querySelector('input[data-name="Business or personal?"]:checked');
        if (checkedPersona) {
          personaValue = checkedPersona.value
        }

        if (formFields["first-name"].length <= 0 || formFields["last-name"].length <= 0 || !personaValue) {
          $(signupNav.children[0]).click();
          document.querySelectorAll('.error-field-missing').forEach((error) => error.style.display = "block");
        } else {

          if (personaValue == "Business") {
            $(signupNav.children[2]).click();
          } else {
            $(nextButton).hide();
          }

          currentStep++;
        }

      } else if (currentStep == 3) {
        if (formFields["business-name"].length <= 0 || formFields["business-url"].length <= 0) {
          $(signupNav.children[2]).click();
          document.querySelectorAll('.error-field-missing').forEach((error) => error.style.display = "block");
        } else {
          $(signupNav.children[3]).click();
          currentStep++;
        }
      } else if (currentStep == 4) {
        if (!formFields["solutions-market-data"] && !formFields["solutions-realtime"] && !formFields["solutions-unique"] && !formFields["solutions-other"]) {
          $(signupNav.children[3]).click();
          document.querySelectorAll('.error-field-missing').forEach((error) => error.style.display = "block");
        } else {
          $(signupNav.children[4]).click();
          $(nextButton).hide();
          $(submitButton).show();
        }
      } else if (currentStep == 5) {
        if (!formFields["details-project-phase"] || !formFields["details-timeline"] || !formFields["details-decision-maker"] || !formFields["details-budget"]) {
          $(signupNav.children[4]).click();
          document.querySelectorAll('.error-field-missing').forEach((error) => error.style.display = "block");
        } else {
          console.log('done!');
        }
      }
      console.log(currentStep)
      window.history.replaceState(null, null, `/setup-account?signupStep=${currentStep}`);

    };

    backButton.onclick = function() {
      var checkedPersona = document.querySelector('input[data-name="Business or personal?"]:checked');
      if (checkedPersona) {
        personaValue = checkedPersona.value
      }
  
      console.log(personaValue)
      if (personaValue == 'Business') {
  
        currentStep = currentStep - 1;
        window.history.replaceState(null, null, `/setup-account?signupStep=${currentStep}`);
  if (currentStep == 3) {
  currentStep = 2
  }
  
        $(signupNav.children[currentStep - 1]).click();
      } else {
        window.history.replaceState(null, null, `/setup-account?signupStep=${currentStep}`);
        $(nextButton).show();
      }

    }
    
    //add click handle to skip button to submit current form values
  document.querySelectorAll('.signup-skip').forEach((button) => {
    	button.onclick = function() {
      	$('form').submit();
      }
  });

    $('form').submit(function(event) {
      event.preventDefault();
      var resultObject = serializeForm($('form'));
      resultObject["user_email"] = user_email
      
      jQuery.ajax({
        method: "POST",
        contentType: "application/json",
        url: "https://account.intrinio.com/hubspot/update_user", 
        data: JSON.stringify(resultObject)
      }).done(function(session, status, xhr) {
        window.location.href = "https://account.intrinio.com/account/overview"
      }).fail(function() {
        document.querySelector('.error-api').style.display = "block";
        window.location.href = "https://account.intrinio.com/account/overview"
      });
    });
  }
  
  getSession();
};

function mountSelectChange(event) {
   const niceSelects = document.querySelectorAll('.nice-select .current');

    for(let niceSelect of niceSelects) {
       let observer = new MutationObserver((mutation) => {
           if(niceSelect.innerText !== 'Select') {
               niceSelect.style.color = '#3B3F42';
           }
       });   

       observer.observe(niceSelect, { characterData: false, attributes: false, childList: true, subtree: false });
    }
}

if(document.readyState === 'complete') {
    mountSelectChange();
} else {
    window.addEventListener('load', mountSelectChange);
}

window.intercomSettings = {
  alignment: 'left',
};
