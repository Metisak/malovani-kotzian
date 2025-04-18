<?php
// Nastavení hlavičky pro správné zobrazení českých znaků
header('Content-Type: text/html; charset=utf-8');

// Kontrola, zda byl formulář odeslán metodou POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Získání dat z formuláře
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));

    // E-mailová adresa, na kterou budou chodit zprávy
    $recipient = "cheondervara@me.com";

    // Předmět e-mailu
    $subject = "Nová zpráva z kontaktního formuláře od: $name";

    // Vytvoření těla e-mailu
    $email_content = "Jméno: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefon: $phone\n\n";
    $email_content .= "Zpráva:\n$message\n";

    // Vytvoření e-mailových hlaviček
    $email_headers = "From: $name <$email>\r\n";
    $email_headers .= "Reply-To: $email\r\n";
    $email_headers .= "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Odeslání e-mailu
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Úspěšné odeslání
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Děkujeme za vaši zprávu. Budeme vás kontaktovat co nejdříve."
        ]);
    } else {
        // Chyba při odesílání
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Omlouváme se, při odesílání zprávy došlo k chybě. Zkuste to prosím později."
        ]);
    }
} else {
    // Nebyla použita metoda POST
    http_response_code(403);
    echo json_encode([
        "status" => "error",
        "message" => "Došlo k chybě, zkuste to prosím znovu."
    ]);
}
?> 