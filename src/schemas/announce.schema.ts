type Keyboard = {
  text: string;
  data: string;
};

class Announce {
  static message: string;
  static image: string;
  static keybords: Keyboard[] = [];
  static status: string = "closed";

  static addMessage(message: string) {
    this.message = message;
  }

  static addImage(id: string) {
    this.image = id;
  }

  static addKeyboard(text: string, data: string) {
    this.keybords.push({
      text,
      data,
    });
  }

  static getMessage() {
    return {
      text: this.message,
      image: this.image,
      keybords: this.keybords,
    };
  }

  static clear() {
    this.message = "";
    this.image = "";

    this.keybords = [];
  }
}

export default Announce;
