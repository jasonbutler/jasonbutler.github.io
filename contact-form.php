<?php
if(isset($_POST['email'])) {
 
    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "oldmanvegas@gmail.com";
    $email_subject = "Site enquiry";
 
    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
 
 
    // validation expected data exists
    if(!isset($_POST['contact_name']) ||
        !isset($_POST['contact_email']) ||
        !isset($_POST['contact_category']) ||
        !isset($_POST['contact_message'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');       
    }
 
     
 
    $contact_name = $_POST['contact_name']; // required
    $contact_email = $_POST['contact_email']; // required
    $contact_category = $_POST['contact_category']; // not required
    $contact_message = $_POST['contact_message']; // required
 
    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$contact_email)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }
 
    $string_exp = "/^[A-Za-z .'-]+$/";
 
  if(!preg_match($string_exp,$contact_name)) {
    $error_message .= 'The Name you entered does not appear to be valid.<br />';
  }

 
  if(strlen($contact_message) < 2) {
    $error_message .= 'The contact_message you entered do not appear to be valid.<br />';
  }
 
  if(strlen($error_message) > 0) {
    died($error_message);
  }
 
    $email_message = "Form details below.\n\n";
 
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
 
     
 
    $email_message .= "Name: ".clean_string($contact_name)."\n";
    $email_message .= "Email: ".clean_string($contact_email)."\n";
    $email_message .= "Category: ".clean_string($contact_category)."\n";
    $email_message .= "Message: ".clean_string($contact_message)."\n";
 
// create email headers
$headers = 'From: '.$contact_email."\r\n".
'Reply-To: '.$contact_email."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  
?>
 
<!-- include your own success html here -->
 
Thank you for contacting us. We will be in touch with you very soon.
 
<?php
 
}
?>