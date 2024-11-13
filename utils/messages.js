const messages = {
    en: {
      selectLanguage: "Please select your language to proceed with verification.",
      verificationMessage: "Click the button below to begin verification.",
      enterCaptcha: "Please enter the captcha code below using `/verify`.",
      verificationComplete: "✅ You have been successfully verified! Verification will complete in 3 seconds.",
      languageNotice: "Please note that the server's primary language is English.",
      incorrectCaptcha: "❌ Incorrect captcha. Please try again.",
      captchaExpired: "You have not requested a captcha or your session has expired. Please retry verification."
    },
    de: {
      selectLanguage: "Bitte wählen Sie Ihre Sprache, um mit der Verifizierung fortzufahren.",
      verificationMessage: "Klicken Sie auf die Schaltfläche unten, um mit der Verifizierung zu beginnen.",
      enterCaptcha: "Bitte geben Sie den untenstehenden Captcha-Code mit `/verify` ein.",
      verificationComplete: "✅ Sie wurden erfolgreich verifiziert! Die Verifizierung wird in 3 Sekunden abgeschlossen.",
      languageNotice: "Bitte beachten Sie, dass die Hauptsprache des Servers Englisch ist.",
      incorrectCaptcha: "❌ Falscher Captcha-Code. Bitte versuchen Sie es erneut.",
      captchaExpired: "Sie haben keinen Captcha angefordert oder Ihre Sitzung ist abgelaufen. Bitte versuchen Sie die Verifizierung erneut."
    },
    tr: {
      selectLanguage: "Doğrulamaya devam etmek için lütfen dilinizi seçin.",
      verificationMessage: "Doğrulamaya başlamak için aşağıdaki düğmeye tıklayın.",
      enterCaptcha: "Lütfen aşağıdaki captcha kodunu `/verify` kullanarak giriniz.",
      verificationComplete: "✅ Başarıyla doğrulandınız! Doğrulama 3 saniye içinde tamamlanacaktır.",
      languageNotice: "Lütfen sunucunun ana dilinin İngilizce olduğunu unutmayın.",
      incorrectCaptcha: "❌ Yanlış captcha kodu. Lütfen tekrar deneyin.",
      captchaExpired: "Bir captcha talebinde bulunmadınız veya oturumunuz sona erdi. Lütfen doğrulamayı tekrar deneyin."
    },
    pt: {
      selectLanguage: "Por favor, selecione seu idioma para continuar com a verificação.",
      verificationMessage: "Clique no botão abaixo para iniciar a verificação.",
      enterCaptcha: "Por favor, insira o código captcha abaixo usando `/verify`.",
      verificationComplete: "✅ Você foi verificado com sucesso! A verificação será concluída em 3 segundos.",
      languageNotice: "Por favor, note que o idioma principal do servidor é o inglês.",
      incorrectCaptcha: "❌ Código captcha incorreto. Por favor, tente novamente.",
      captchaExpired: "Você não solicitou um captcha ou sua sessão expirou. Por favor, tente a verificação novamente."
    },
    fr: {
      selectLanguage: "Veuillez sélectionner votre langue pour continuer la vérification.",
      verificationMessage: "Cliquez sur le bouton ci-dessous pour commencer la vérification.",
      enterCaptcha: "Veuillez entrer le code captcha ci-dessous en utilisant `/verify`.",
      verificationComplete: "✅ Vous avez été vérifié avec succès ! La vérification sera terminée dans 3 secondes.",
      languageNotice: "Veuillez noter que la langue principale du serveur est l'anglais.",
      incorrectCaptcha: "❌ Code captcha incorrect. Veuillez réessayer.",
      captchaExpired: "Vous n'avez pas demandé de captcha ou votre session a expiré. Veuillez réessayer la vérification."
    },
    es: {
      selectLanguage: "Por favor, seleccione su idioma para continuar con la verificación.",
      verificationMessage: "Haga clic en el botón de abajo para comenzar la verificación.",
      enterCaptcha: "Por favor, ingrese el código captcha a continuación usando `/verify`.",
      verificationComplete: "✅ ¡Ha sido verificado exitosamente! La verificación se completará en 3 segundos.",
      languageNotice: "Tenga en cuenta que el idioma principal del servidor es el inglés.",
      incorrectCaptcha: "❌ Captcha incorrecto. Por favor, intente de nuevo.",
      captchaExpired: "No ha solicitado un captcha o su sesión ha expirado. Por favor, intente la verificación nuevamente."
    },
    ru: {
      selectLanguage: "Пожалуйста, выберите свой язык, чтобы продолжить проверку.",
      verificationMessage: "Нажмите кнопку ниже, чтобы начать проверку.",
      enterCaptcha: "Пожалуйста, введите капчу ниже, используя `/verify`.",
      verificationComplete: "✅ Вы успешно прошли проверку! Проверка будет завершена через 3 секунды.",
      languageNotice: "Обратите внимание, что основной язык сервера — английский.",
      incorrectCaptcha: "❌ Неверная капча. Пожалуйста, попробуйте еще раз.",
      captchaExpired: "Вы не запросили капчу или ваша сессия истекла. Пожалуйста, повторите проверку."
    }
  };
  
  function getMessage(languageCode, messageKey) {
    return messages[languageCode][messageKey] || messages['en'][messageKey]; // Fallback to English if message is missing
  }
  
  module.exports = {
    getMessage
  };
  