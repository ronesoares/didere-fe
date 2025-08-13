class DateBR extends Date {
  toDateBR() {
    return this.toLocaleDateString('pt-BR');
  }

  toUTC3() {
    return new Date(this.getTime() - 3 * 60 * 60 * 1000);
  }
}

export default DateBR;