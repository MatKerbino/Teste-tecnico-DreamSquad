export function formatDocument(value: string): string {
    const digits = value.replace(/\D/g, '')
    const clearValue = digits.slice(0, 14)

    if (clearValue.length <= 11) {
        return clearValue
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    return clearValue
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
}

export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const cpfs = cpf.split('').map(el => +el);
    const getDigit = (count: number) => {
        let sum = 0;
        for (let i = 0; i < count - 1; i++) sum += cpfs[i] * (count - i);
        let remainder = (sum * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };
    return getDigit(10) === cpfs[9] && getDigit(11) === cpfs[10];
}

export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
    const calculateDigit = (numbers: string, multipliers: number[]) => {
        let sum = 0;
        for (let i = 0; i < multipliers.length; i++) sum += parseInt(numbers[i]) * multipliers[i];
        let remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };
    const firstDigit = calculateDigit(cnpj.substring(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(cnpj.substring(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13]);
}

export function isValidDocument(doc: string): boolean {
    const digits = doc.replace(/\D/g, '');
    if (digits.length === 11) return isValidCPF(digits);
    if (digits.length === 14) return isValidCNPJ(digits);
    return false;
}
