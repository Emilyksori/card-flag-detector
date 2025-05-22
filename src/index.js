const cardPatterns = {
  Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MasterCard: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{14}|7[01][0-9]{13}|720[0-9]{12}))$/,
  AmericanExpress: /^3[47][0-9]{13}$/,
  Discover: /^(6011[0-9]{12}|65[0-9]{14}|64[4-9][0-9]{13})$/,
  Elo: /^(4011|4312|4389|4514|4576|5041|5066|5067|5090|5091|5092|5093|5094|5095|5096|5097|5098|5099|6277|6362|6504|6505|6509|6516|6550)[0-9]{10,13}$/,
  Hipercard: /^(6062[0-9]{12}|3841[0-9]{12})$/
};

function getCardIssuer(cardNumber) {
  const sanitized = cardNumber.replace(/\D/g, '');
  for (const [issuer, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(sanitized)) {
      return issuer;
    }
  }
  return null;
}

function luhnAlgorithm(cardNumber) {
  const sanitized = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function validateCreditCard(cardNumber) {
  const isValid = luhnAlgorithm(cardNumber);
  const bandeira = getCardIssuer(cardNumber);
  return {
    valid: isValid && !!bandeira,
    bandeira: isValid ? bandeira : null
  };
}

function checkCard() {
  const cardNumber = document.getElementById('cardInput').value;
  const result = validateCreditCard(cardNumber);
  const resultCard = document.getElementById('result-card');
  const iconSuccess = document.getElementById('icon-success');
  const iconError = document.getElementById('icon-error');
  const resultMessage = document.getElementById('result-message');
  const tryAgainBtn = document.getElementById('try-again');

  resultCard.classList.remove('hidden');
  iconSuccess.classList.add('hidden');
  iconError.classList.add('hidden');
  tryAgainBtn.classList.add('hidden');
  resultMessage.classList.remove('success', 'error');

  if (result.valid) {
    iconSuccess.classList.remove('hidden');
    resultMessage.textContent = `SUCESSO!\nBandeira: ${result.bandeira}`;
    resultMessage.classList.add('success');
    tryAgainBtn.classList.add('hidden');
  } else {
    iconError.classList.remove('hidden');
    resultMessage.textContent = 'OH NO...\nCartão inválido ou bandeira não reconhecida.';
    resultMessage.classList.add('error');
    tryAgainBtn.classList.remove('hidden');
  }
}

function resetForm() {
  document.getElementById('cardInput').value = '';
  document.getElementById('result-card').classList.add('hidden');
}
