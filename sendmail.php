<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $personName   = htmlspecialchars($_POST['personName'] ?? '');
    $eventName    = htmlspecialchars($_POST['eventName'] ?? '');
    $email        = htmlspecialchars($_POST['email'] ?? '');
    $phone        = htmlspecialchars($_POST['phone'] ?? '');
    $sex          = htmlspecialchars($_POST['sex'] ?? '');
    $airport      = htmlspecialchars($_POST['airport'] ?? '');
    $budget       = htmlspecialchars($_POST['budget'] ?? '');
    $eventType    = htmlspecialchars($_POST['eventType'] ?? '');
    $eventDetails = htmlspecialchars($_POST['eventDetails'] ?? '');

    $mail = new PHPMailer(true);

    try {
        // SMTP settings (replace with your mail server)
        $mail->isSMTP();
        $mail->Host       = 'mail.caagency.uk'; // e.g. smtp.ionos.com, smtp.gmail.com
        $mail->SMTPAuth   = true;
        $mail->Username   = 'bookings@caagency.uk';  // your email
        $mail->Password   = 'bookings@caagency.uk';    // password or app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or ENCRYPTION_SMTPS
        $mail->Port       = 587; // 587 for TLS, 465 for SSL

        // Sender & recipient
        $mail->setFrom('bookings@caagency.uk', 'CAA Booking Form');
        $mail->addAddress('bookings@caagency.uk'); // send to yourself
        $mail->addReplyTo($email, $personName);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "New Booking Request from $personName";
        $mail->Body    = "
        <div style='font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;'>
  <h2 style='color: #2c3e50; font-size: 20px; margin-bottom: 15px;'>You have received a new booking request from <span style='color:#0073e6;'>CAA</span></h2>
  
  <p style='margin: 8px 0;'><strong>Name:</strong> $personName</p>
  <p style='margin: 8px 0;'><strong>Email:</strong> $email</p>
  <p style='margin: 8px 0;'><strong>Phone:</strong> $phone</p>
  <p style='margin: 8px 0;'><strong>Event Name:</strong> $eventName</p>
  <p style='margin: 8px 0;'><strong>Sex:</strong> $sex</p>
  <p style='margin: 8px 0;'><strong>Nearest Airport:</strong> $airport</p>
  <p style='margin: 8px 0;'><strong>Budget:</strong> $budget</p>
  <p style='margin: 8px 0;'><strong>Event Type:</strong> $eventType</p>
  <p style='margin: 8px 0;'><strong>Event Details:</strong><br>$eventDetails</p>
  
  <hr style='margin: 20px 0; border: none; border-top: 1px solid #ccc;'>
  
  <p style='font-size: 14px; color: #555;'>This booking request was submitted via the <strong>CAA Booking Portal</strong>. Please review the details above and respond accordingly.</p>
</div>

        ";

        $mail->AltBody = "Name: $personName\nEmail: $email\nPhone: $phone\nEvent: $eventName\nSex: $sex\nAirport: $airport\nBudget: $budget\nType: $eventType\nDetails: $eventDetails";

        $mail->send();

        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}