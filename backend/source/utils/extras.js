function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isNumeric(value) {
  if (value == '') return false;
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function isLengthEqualTo(string, length) {
  return string.length === length;
}

function isLengthGreaterThan(string, length = 5) {
  return string.length > length;
}

function isLengthLesserThan(string, length) {
  return string.length < length;
}

function isOnlyLetters(string) {
  if (string == '') return false;
  return /^[A-Za-zÀ-ÿ\s]+$/u.test(string.trim());
}

function keepOnlyNumbers(string) {
  if (!string || string === '') return false;
  const output = string.replace(/\D/g, '');
  if (output === '') return false;
  return output;
}

function keepOnlyLettersAndNumbers(string) {
  if (!string || string === '') return false;
  const output = string.replace(/[^A-Za-z0-9À-ÿ]/g, '');
  if (output === '') return false;
  return output;
}

function keepOnlyLetters(string) {
  if (!string || string === '') return false;
  const output = string.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (output === '') return false;
  return output;
}

function isValidCPF(cpf) {
  if (!cpf || cpf == '') return false;
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
  if (firstCheck !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
  return secondCheck === parseInt(cpf.charAt(10));
}

module.exports = { isPlainObject, isNumeric, isLengthEqualTo, isLengthGreaterThan, isLengthLesserThan, isOnlyLetters, keepOnlyLetters, keepOnlyLettersAndNumbers, keepOnlyNumbers, isValidCPF };
