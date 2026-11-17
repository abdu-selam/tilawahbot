export type Keyboard = {
  text: string;
  data: string;
  type: string;
};

type StatusType = "closed" | "image" | "message" | "keyboard" | "finish";

class Announce {
  static message: string;
  static image: string;
  static keybords: Keyboard[] = [];
  static status: StatusType = "closed";

  static addMessage(message: string) {
    if (this.status !== "message") {
      return false;
    }
    this.message = message;
    this.status = "keyboard";
    return true;
  }

  static addImage(id: string) {
    if (this.status !== "image") {
      return false;
    }
    this.image = id;
    this.status = "message";
    return true;
  }

  static addKeyboard(values: Keyboard[]) {
    if (this.status !== "keyboard") {
      return false;
    }
    
    values.forEach(({ text, data, type }) => {
      this.keybords.push({
        text,
        data,
        type,
      });
    });

    this.status = "finish";
    return true;
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
    this.status = "closed";
  }

  static start() {
    this.clear();

    this.status = "image";
  }
}

export default Announce;
