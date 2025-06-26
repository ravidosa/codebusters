const en_alphabet = "abcdefghijklmnopqrstuvwxyz"
const es_alphabet = "abcdefghijklmnñopqrstuvwxyz"
const baconian = ["aaaaa", "aaaab", "aaaba", "aaabb", "aabaa", "aabab", "aabba", "aabbb", "abaaa", "abaaa", "abaab", "ababa", "ababb", "abbaa", "abbab" ,"abbba", "abbbb", "baaaa", "baaab", "baaba", "baabb", "baabb", "babaa", "babab", "babba", "babbb"]
const alt_baconian = [{a: "a", b: "b"}, {a: "b", b: "a"}, {a: "1", b: "0"}, {a: "0", b: "1"}, {a: "/", b: "\\"}, {a: "\\", b: "/"}, {a: "╩", b: "╦"}, {a: "╦", b: "╩"}, {a: "Ṿ", b: "Å"}, {a: "Å", b: "Ṿ"}]
const mangled_words = {"I": "eye", "your": "you're", "you": "ewe", "time": "thyme", "all": "awl", "the": "teh", "one": "won", "sees": "seize", "life": "lief", "for": "four", "to": "two", "choose": "chews", "do": "dew", "not": "knot", "see": "sea", "world": "whirled", "soul": "sole", "be": "bee", "in": "inn", "driving": "dirving", "we": "wee", "have": "halve", "waiter": "wader", "or": "oar", "you'll": "yule", "better": "bettor", "but": "butt", "and": "adn", "their": "there", "years": "yaers", "find": "fined", "by": "buy", "greater": "grater", "take": "taek", "shown": "shone", "told": "tolled", "plate": "plait", "back": "back", "scientist": "scnetiist", "new": "knew", "would": "wood", "an": "in", "that": "taht", "there's": "theirs", "some": "sum", "birth": "berth", "which": "witch", "right": "write", "great": "grate"}

class Cipher extends React.Component {
  
    constructor(props) {
      super(props)

      this.state = { 
        plaintext: "",
        source: "",
        letter: "_",
        selectedLetter: "",
        selectedIndex: null,
        mapping: [],
        guesses: "__________________________".split(""),
        probType: "",
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
        score: [0, 0],
        checked: false,
        alphabet: en_alphabet,
        questions: [],
        maracheck: 0,
        name: "",
        record: false,
        hint: "",
        encoding: "",
        mangle: false,
        error: ""
      }

      this.setLetter = this.setLetter.bind(this);
      this.selectLetter = this.selectLetter.bind(this);
      this.getProb = this.getProb.bind(this);
      this.nextProb = this.nextProb.bind(this);
      this.checkProb = this.checkProb.bind(this);
      this.startMarathon = this.startMarathon.bind(this);
      this.sendMarathon = this.sendMarathon.bind(this);
      this.setData = this.setData.bind(this);
    }

    setLetter(event) {
      if (event.key == "`" || (event.key >= "a" && event.key <= "z")) {
        if (event.key == "`") {
          event.key = "ñ";
        }
      if (this.state.probType !== "Baconian Cipher") {
        if (this.state.alphabet.indexOf(this.state.selectedLetter) !== -1) {
            let newguess = this.state.guesses;
            newguess[this.state.alphabet.indexOf(this.state.selectedLetter)] = event.key;
            let split = this.state.plaintext.split(" ");
            let ind = this.state.selectedIndex.split("-");
            let nextIndex = null;
            let nextLetter = "";
            if (parseInt(ind[1]) != split[parseInt(ind[0])].length - 1) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0])][parseInt(ind[1]) + 1])];
              nextIndex = `${parseInt(ind[0])}-${parseInt(ind[1]) + 1}`;
            }
            else if (parseInt(ind[0]) < split.length) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0]) + 1][0])];
              nextIndex = `${parseInt(ind[0]) + 1}-0`;
            }
            this.setState({ guesses: newguess, selectedLetter: nextLetter, selectedIndex: nextIndex});
          }
        }
        if (this.state.probType === "Baconian Cipher") {
          let newguess = this.state.guesses;
          newguess[this.state.mapping.indexOf(this.state.selectedLetter)] = event.key;
          this.setState({ guesses: newguess});
        }
      }
      else if (this.state.probType !== "Baconian Cipher") {
        if (event.key == "ArrowLeft") {
          let split = this.state.plaintext.split(" ");
            let ind = this.state.selectedIndex.split("-");
            let nextIndex = null;
            let nextLetter = "";
            if (parseInt(ind[1]) != 0) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0])][parseInt(ind[1]) - 1])];
              nextIndex = `${parseInt(ind[0])}-${parseInt(ind[1]) - 1}`;
            }
            else if (parseInt(ind[0]) > 0) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0]) - 1][split[parseInt(ind[0]) - 1].length - 1])];
              nextIndex = `${parseInt(ind[0]) - 1}-${split[parseInt(ind[0]) - 1].length - 1}`;
            }
            this.setState({selectedLetter: nextLetter, selectedIndex: nextIndex});
        }
        else if (event.key == "ArrowRight") {
          let split = this.state.plaintext.split(" ");
            let ind = this.state.selectedIndex.split("-");
            let nextIndex = null;
            let nextLetter = "";
            if (parseInt(ind[1]) != split[parseInt(ind[0])].length - 1) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0])][parseInt(ind[1]) + 1])];
              nextIndex = `${parseInt(ind[0])}-${parseInt(ind[1]) + 1}`;
            }
            else if (parseInt(ind[0]) < split.length) {
              nextLetter = this.state.mapping[this.state.alphabet.indexOf(split[parseInt(ind[0]) + 1][0])];
              nextIndex = `${parseInt(ind[0]) + 1}-0`;
            }
            this.setState({selectedLetter: nextLetter, selectedIndex: nextIndex});
        }
      }
    }

    selectLetter(event) {
      if (this.state.probType !== "Baconian Cipher") {
        if (event.target.innerText[0].match(/[ña-z]/i)) {
          this.setState({ selectedLetter: event.target.innerText[0], selectedIndex: event.target.id});
        }
      }
      else {
        this.setState({ selectedLetter: event.target.innerText.slice(0, 5), selectedIndex: event.target.id});
      }
    }

    async getProb(probType) {
      this.setState({probType: (probType === 'aristocrat' ? "Aristocrat Cipher" : probType === 'affine' ? "Affine Cipher" : probType === 'patristocrat' ? "Patristocrat Cipher" : probType === 'atbash' ? "Atbash Cipher" : probType === 'caesar' ? "Caesar Cipher" : probType === 'xenocrypt' ? "Xenocrypt" : probType === 'baconian' ? "Baconian Cipher": null)})
      let array = (probType !== 'xenocrypt' ? en_alphabet : es_alphabet).split("");
      let a, b = null;
      let hint, encoding = "";
      let mangle = false;
      if (probType === "aristocrat" || probType === "patristocrat" || probType === "xenocrypt") {
        const k = Math.floor(Math.random() * 6);
        if ((k < 3 && probType === "aristocrat") || (k < 1 && probType === "patristocrat") || (k < 6 && probType === "xenocrypt")) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
        }
        else if ((k < 5 && probType === "aristocrat") || (k < 4 && probType === "patristocrat") || (k < 9 && probType === "xenocrypt")) {
          encoding = "k1";
          let k1response = await fetch('https://api.allorigins.win/raw?url=https://random-word-api.herokuapp.com/word');
          let k1data = await k1response.json();
          k1data = k1data[0].split('').filter((item, pos, self) => {return self.indexOf(item) == pos;}).join('');
          array = (k1data + array.join("").replace(new RegExp(k1data.split("").join("|"), "gi"), "")).split("");
          const l = Math.floor(Math.random() * (array.length - k1data.length));
          for (let i = array.length; i > l; i--) {
            array.push(array.shift())
          }
          let temp = [];
          for (let m = 0; m < array.length; m++) {
            temp.push((probType !== 'xenocrypt' ? en_alphabet : es_alphabet)[array.indexOf((probType !== 'xenocrypt' ? en_alphabet : es_alphabet)[m])])
          }
          array = temp;
        }
        else if ((k < 6 && probType === "aristocrat") || (k < 6 && probType === "patristocrat") || (k < 12 && probType === "xenocrypt")) {
          encoding = "k2";
          let k2response = await fetch('https://api.allorigins.win/raw?url=https://random-word-api.herokuapp.com/word');
          let k2data = await k2response.json();
          k2data = k2data[0].split('').filter((item, pos, self) => {return self.indexOf(item) == pos;}).join('');
          array = (k2data + array.join("").replace(new RegExp(k2data.split("").join("|"), "gi"), "")).split("");
          const l = Math.floor(Math.random() * (array.length - k2data.length));
          for (let i = array.length; i > l; i--) {
            array.push(array.shift())
          }
        }
      }
      else if (probType === "atbash") {
        array.reverse();
      }
      else if (probType === "caesar") {
        for (let i = 0; i < Math.floor(Math.random() * 26); i++) {
          array.push(array.shift())
        }
      }
      else if (probType === "affine") {
        a = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25][Math.floor(Math.random() * 12)];
        b = Math.floor(Math.random() * 26);
        for (let i = 0; i < array.length; i++) {
          array[i] = en_alphabet.charAt((a * i + b) % 26);
        }
      }

      if (probType === "baconian") {
        let response = await fetch('https://api.allorigins.win/raw?url=https://random-word-api.herokuapp.com/word');
        let data = await response.json();
        const k = Math.floor(Math.random() * 3);
        if (k < 1) {
          hint = "The message starts with " + data[0].slice(0, 3)
        }
        let obj = alt_baconian[Math.floor(Math.random() * alt_baconian.length)];
        let mapping = baconian.map((key, value) => {return key.replace(new RegExp(Object.keys(obj).join("|"), "gi"), (matched) => {return obj[matched];})})
        this.setState({plaintext: data[0], mapping: mapping, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint});
      }
      else {
        let response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io?api=random');
        let data = await response.json();
        data = data[0];
        if (probType === "aristocrat" || probType === "patristocrat" || probType === "affine") {
          const k = Math.floor(Math.random() * 12);
          if (k < 2 && probType === "aristocrat") {
            data.q = data.q.split(" ").map((key) => {return (mangled_words[key.toLowerCase()] || key)}).join(" ");
            mangle = true;
          }
          if ((k < 6 && probType === "patristocrat") || (k < 3 && probType === "aristocrat")) {
            const l = Math.floor(Math.random() * 8);
            if (l < 3.5) {
              hint = "The message starts with " + data.q.replace(/[^A-Za-z]/g, "").toLowerCase().slice(0, l + 1)
            }
            else {
              hint = "The message ends with " + data.q.replace(/[^A-Za-z]/g, "").toLowerCase().slice(3 - l)
            }
          }
          else if (probType === "affine") {
            if (k < 6) {
              hint = "a = " + a + ", b = " + b;
            }
            else if (k < 9) {
              hint = "The message starts with " + data.q.replace(/[^A-Za-z]/g, "").toLowerCase().slice(0, 2)
            }
            else {
              hint = "The message ends with " + data.q.replace(/[^A-Za-z]/g, "").toLowerCase().slice(-2)
            }
          }
        }
        if (probType === "aristocrat" || probType === "atbash" || probType === "caesar") {
          this.setState({plaintext: data.q.toLowerCase(), source: data.a, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: ""});
        }
        else if (probType === "patristocrat" || probType === "affine") {
          this.setState({plaintext: data.q.replace(/[^A-Za-z]/g, "").toLowerCase(), source: data.a, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet, hint: hint, encoding: encoding, mangle: mangle, error: ""});
        }
        else if (probType === "xenocrypt") {
          let transresponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(data.q)}`, {mode: 'cors'});
          if (transresponse.status === 200) {

            let trans = await transresponse.json();
            this.setState({plaintext: trans[0][0][0].replace('ñ','|').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('|','ñ').toLowerCase(), source: data.a, mapping: array, guesses: "___________________________".split(""), checked: false, alphabet: es_alphabet,  hint: hint, encoding: encoding, mangle: mangle, error: ""});
          }
          else {
            if (this.props.marathon) {
              array.splice(array.indexOf("ñ"), 1)
              this.setState({plaintext: data.q.toLowerCase(), source: data.a, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet,  hint: hint, encoding: encoding, mangle: mangle, probType: "Aristocrat Cipher", error: ""});
            }
            else {
              array.splice(array.indexOf("ñ"), 1)
              this.setState({plaintext: data.q.toLowerCase(), source: data.a, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet,  hint: hint, encoding: encoding, mangle: mangle, probType: "Aristocrat Cipher", error: "Translation services are down; here's an aristocrat instead!"});
            }
          }
        }
      }
    }

    nextProb() {
      if (this.props.marathon) {
        this.checkProb();
        this.getProb(["aristocrat", "atbash", "caesar", "patristocrat", "affine", "baconian", "xenocrypt"][Math.floor(Math.random() * 7)]);
      }
      else {
        this.getProb(this.props.type);
      }
    }

    checkProb() {
      let mistakes = 0;
      if (this.state.probType !== "Baconian Cipher") {
        for (let i = 0; i < this.state.alphabet.length; i++) {
          if (this.state.alphabet.split("")[i].localeCompare(this.state.guesses[this.state.alphabet.indexOf(this.state.mapping[i])].charAt(0)) && this.state.plaintext.indexOf(this.state.alphabet.split("")[i]) !== -1) {
            mistakes += 1;
          }
        }
      }
      else {
        for (let i = 0; i < this.state.alphabet.length; i++) {
          if (this.state.guesses.indexOf(this.state.alphabet.split("")[i]) !== i && this.state.plaintext.indexOf(this.state.alphabet.split("")[i]) !== -1) {
            mistakes += 1;
          }
        }
      }
      if (mistakes < 2 && !this.state.checked) {
        this.setState({score: [this.state.score[0] + 1, this.state.score[1] + 1], checked: true})
      }
      else if (!this.state.checked) {
        this.setState({score: [this.state.score[0], this.state.score[1] + 1], checked: true})
      }

      if (this.props.marathon && !this.state.checked) {
        let currq = this.state.questions;
        currq.push({question: this.state.plaintext, mistakes: mistakes, time: Math.floor(this.state.timerTime / 1000), type: this.state.probType.split(" ")[0].toLowerCase(), hint: ((this.state.hint && this.state.hint.length > 0) ? this.state.hint : null), mangle: this.state.mangle, encoding: (this.state.encoding.length > 0 ? this.state.encoding : null)})
        this.setState({questions: currq});
      }
    }

    async startMarathon() {
      this.setState({maracheck: 1, score: [0, 0], questions: []})
      await this.stopTimer();
      await this.resetTimer();
      this.startTimer();
    }

    async sendMarathon() {
      if (this.state.record) {
        await this.checkProb();
        await firebase.database().ref('results/' + this.state.name + " (" + new Date() + ")").set({
          name: this.state.name,
          questions: this.state.questions,
          time: Math.floor(this.state.timerTime / 1000),
          correct: this.state.score[0],
          score: this.state.questions.reduce((a, b) => a + this.computeScore(b), 0)
        });
      }
      this.setState({maracheck: 2})
    }

    computeScore(question) {
      if (question.type === "atbash" || question.type === "caesar" || question.type === "affine") {
        return Math.max(0, 100 - (100 * Math.max(0, question.mistakes - 2)));
      }
      else if (question.type === "baconian") {
        return Math.max(0, 200 - (100 * Math.max(0, question.mistakes - 2)));
      }
      else if (question.type === "aristocrat") {
        if (question.hint) {
          if (question.mangle) {
            if (question.hint.split(" ")[question.hint.split(" ").length - 1].length > 3) {
              return Math.max(0, 500 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (50 * (question.hint.split(" ")[question.hint.split(" ").length - 1].length - 3)) - (100 * Math.max(0, question.mistakes - 2)));
            }
            else {
              return Math.max(0, 500 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
            }
          }
          else {
            return Math.max(0, 200 - (100 * Math.max(0, question.mistakes - 2)));
          }
        }
        else {
          if (question.mangle) {
            return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
          }
          else {
            return Math.max(0, 350 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
          }
        }
      }
      else if (question.type === "patristocrat") {
        if (question.hint) {
          if (question.hint.split(" ")[question.hint.split(" ").length - 1].length > 3) {
            return Math.max(0, 650 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (50 * (question.hint.split(" ")[question.hint.split(" ").length - 1].length - 3)) - (100 * Math.max(0, question.mistakes - 2)));
          }
          else {
            return Math.max(0, 650 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
          }
        }
        else {
          return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
        }
      }
      else if (question.type === "xenocrypt") {
        return Math.max(0, 700 - (question.encoding === "k1" ? 100 : question.encoding === "k1" ? 75: 0) - (100 * Math.max(0, question.mistakes - 2)));
      }
    }

    setData() {
      if (event.target.name == "name") {
        this.setState({name: event.target.value})
      }
      else if (event.target.name == "record") {
        this.setState({record: event.target.checked})
      }
    }

    startTimer = () => {
      this.setState({
        timerOn: true,
        timerTime: this.state.timerTime,
        timerStart: Date.now() - this.state.timerTime
      });
      this.timer = setInterval(() => {
        this.setState({
          timerTime: Date.now() - this.state.timerStart
        });
      }, 10);
    };
  
    stopTimer = () => {
      this.setState({ timerOn: false });
      clearInterval(this.timer);
    };
  
    resetTimer = () => {
      this.setState({
        timerStart: 0,
        timerTime: 0
      });
    };

    componentDidMount() {
      this.getProb(this.props.type);
      this.startTimer();
    }

    componentDidUpdate(prevProps) {
      if (this.props.type !== prevProps.type || this.props.marathon !== prevProps.marathon) {
        this.getProb(this.props.type);
      }
    }
    
    render() {
      let centiseconds = ("0" + (Math.floor(this.state.timerTime / 10) % 100)).slice(-2);
      let seconds = ("0" + (Math.floor(this.state.timerTime / 1000) % 60)).slice(-2);
      let minutes = ("0" + (Math.floor(this.state.timerTime / 60000) % 60)).slice(-2);
      let hours = ("0" + Math.floor(this.state.timerTime / 3600000)).slice(-2);
      
      return <div class="container">
        {(!this.props.marathon || this.state.maracheck === 1) && (
          <div className={`box content`} tabIndex={-1} onKeyDown={this.setLetter}>
          <h1>{this.state.probType}</h1>
          {this.state.probType !== "Baconian Cipher" && (
            <p>{`Solve this code by ${this.state.source} which has been ${(this.state.mangle ? "badly misheard and" : "")} encoded as a${("AEIOU".indexOf(this.state.probType.charAt(0)) !== -1 ? "n" : "") + " " + this.state.probType}${(this.state.encoding.length > 0 ? " using a " + this.state.encoding + " alphabet" : "")}.`}</p>
          )}
          {this.state.probType === "Baconian Cipher" && (
            <p>{`Solve this message which has been encoded as a Baconian Cipher.`}</p>
          )}
          {this.state.hint && this.state.hint.length > 0 && (
            <p>{"hint: " + this.state.hint}</p>
          )}
          {this.state.error && this.state.error.length > 0 && (
            <p class="warning">{this.state.error}</p>
          )}
          {this.state.probType !== "Baconian Cipher" && (
              this.state.plaintext.toLowerCase().split(" ").map((word, windex) => {
                  return(
                      <div class="word" onClick={this.selectLetter}>
                          {
                              word.split("").map((letter, lindex) => {
                                  if (this.state.alphabet.indexOf(letter) !== -1) {
                                      return(
                                          <div class={`letter ${`${windex}-${lindex}` === this.state.selectedIndex ? "letter-selected" : ""}`} id={`${windex}-${lindex}`}>
                                              <div className={`${this.state.mapping[this.state.alphabet.indexOf(letter)] === this.state.selectedLetter ? "selected" : ""}`}>{this.state.mapping[this.state.alphabet.indexOf(letter)]}</div>
                                              <div>{this.state.guesses[this.state.alphabet.indexOf(this.state.mapping[this.state.alphabet.indexOf(letter)])]}</div>
                                          </div>
                                      )
                                  }
                                  else {
                                      return(
                                          <div class={`letter ${`${windex}-${lindex}` === this.state.selectedIndex ? "letter-selected" : ""}`} id={`${windex}-${lindex}`}>
                                              <div>{letter}</div>
                                              <div>&nbsp;</div>
                                          </div>
                                      )
                                  }
                              })
                          }
                      </div>
                  )
              })
          )}
          {this.state.probType === "Baconian Cipher" && (
              <div class="word" onClick={this.selectLetter}>
                  {
                      this.state.plaintext.split("").map((letter, index) => {
                          if (this.state.alphabet.indexOf(letter) !== -1) {
                              return(
                                  <div class="letter" id={index}>
                                      <div className={`${this.state.mapping[this.state.alphabet.indexOf(letter)] === this.state.selectedLetter ? "selected" : ""}`}>{this.state.mapping[this.state.alphabet.indexOf(letter)]}</div>
                                      <div>&nbsp;&nbsp;{this.state.guesses[this.state.mapping.indexOf(this.state.mapping[this.state.alphabet.indexOf(letter)])]}&nbsp;&nbsp;</div>
                                  </div>
                              )
                          }
                          else {
                              return(
                                  <div class="letter">
                                      <div>{letter}</div>
                                      <div>&nbsp;</div>
                                  </div>
                              )
                          }
                      })
                  }
              </div>
          )}
          {this.state.probType !== "Baconian Cipher" && (
              <table>
                <tr>
                    {
                      this.state.alphabet.split("").map((letter, index) => {
                        return <th>{letter}</th>
                      })
                    }
                </tr>
                <tr>
                    {
                      this.state.alphabet.split("").map((letter, index) => {
                        return <td>{(this.state.plaintext.match(new RegExp(this.state.alphabet[this.state.mapping.indexOf(letter)], "g")) || []).length}</td>
                      })
                    }
                </tr>
                <tr>
                    {
                      this.state.alphabet.split("").map((letter, index) => {
                        return <td>{this.state.guesses[this.state.alphabet.indexOf(letter)]}</td>
                      })
                    }
                </tr>
            </table>
          )}
          <div className="stopwatch">
            <div className={`stopwatch-display ${parseInt(minutes) >= 50 ? "warning" : ""}`}>
              {hours} : {minutes} : {seconds} : {centiseconds}
            </div>
            <br></br>
            {this.state.timerOn === false && this.state.timerTime === 0 && (
              <button onClick={this.startTimer}>start</button>
            )}
            {this.state.timerOn === true && !this.props.marathon && (
              <button onClick={this.stopTimer}>stop</button>
            )}
            {this.state.timerOn === false && this.state.timerTime > 0 && !this.props.marathon && (
              <button onClick={this.startTimer}>resume</button>
            )}
            {this.state.timerOn === false && this.state.timerTime > 0 && !this.props.marathon && (
              <button onClick={this.resetTimer}>reset</button>
            )}
          </div>
          <h5>{this.state.score[0] + "/" + this.state.score[1]}</h5>
          <div class="prevnext">
            <button onClick={this.checkProb}>check</button>
            <button onClick={this.nextProb}>next</button>
            {this.props.marathon && (
              <button onClick={this.sendMarathon}>finish!</button>
            )}
          </div>
        </div>
        )}
        {(this.props.marathon && this.state.maracheck === 0) && (
          <div className={`box content`}>
            <h1>codebusters test</h1>
            <p>marathon mode gives you randomized question types from the ones available. if you select the record option, your results will be recorded and sent to a server where others can view your results. it's also an easy way to do codebusters tryouts online. good luck! ヽ(*・ω・)ﾉ</p>
            <label for="record">record? <input type="checkbox" id="record" name="record" onChange={this.setData}></input></label>
            <br></br>
            <label for="name">enter name: <input type="text" id="name" name="name" onChange={this.setData}></input></label>
            <br></br>
            <button onClick={this.startMarathon}>start</button>
          </div>
        )}
        {(this.props.marathon && this.state.maracheck === 2) && (
          <div className={`box content`}>
            <h1>test complete!</h1>
            <p>we pride ourselves on transparency. if you selected record, go <a href="https://codebusters-406e6.firebaseio.com/results.json" target="_blank">here</a> to check your results. or <a href="https://github.com/ravidosa/codebusters" target="_blank">here</a> to check out the source code.</p>
            <h5>{"score: " + this.state.questions.reduce((a, b) => a + this.computeScore(b), 0)}</h5>
          </div>
        )}
      </div>;
    }
    
  }
