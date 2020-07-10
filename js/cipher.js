const en_alphabet = "abcdefghijklmnopqrstuvwxyz"
const es_alphabet = "abcdefghijklmnñopqrstuvwxyz"

class Cipher extends React.Component {
  
    constructor(props) {
      super(props)

      this.state = { 
        plaintext: "",
        source: "",
        letter: "_",
        selectedLetter: "",
        mapping: [],
        guesses: "__________________________".split(""),
        probType: "",
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
        score: [0, 0],
        checked: false,
        alphabet: en_alphabet
      }

      this.setLetter = this.setLetter.bind(this);
      this.selectLetter = this.selectLetter.bind(this);
      this.getProb = this.getProb.bind(this);
      this.nextProb = this.nextProb.bind(this);
      this.checkProb = this.checkProb.bind(this);
    }

    setLetter(event) {
        if (event.key == "`") {
          event.key = "ñ"
        }
        if (this.state.alphabet.indexOf(this.state.selectedLetter) !== -1) {
          let newguess = this.state.guesses;
          newguess[this.state.alphabet.indexOf(this.state.selectedLetter)] = event.key;
          console.log(this.state.selectedLetter, this.state.alphabet.indexOf(this.state.selectedLetter), this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)], this.state.plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)]), this.state.plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)]) + 1), this.state.alphabet.indexOf(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)]) + 1)), this.state.mapping[this.state.alphabet.indexOf(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)]) + 1))])
          this.setState({ guesses: newguess, selectedLetter: this.state.mapping[this.state.alphabet.indexOf(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").charAt(this.state.plaintext.replace(/[^ñA-Za-z]/g, "").indexOf(this.state.mapping[this.state.alphabet.indexOf(this.state.selectedLetter)]) + 1))]});
        }
    }

    selectLetter(event) {
        if (event.target.innerText[0].match(/[ña-z]/i)) {
            this.setState({ selectedLetter: event.target.innerText[0] });
        }
    }

    getProb(probType) {
      this.setState({probType: (probType === 'aristocrat' ? "Aristocrat Cipher" : probType === 'affine' ? "Affine Cipher" : probType === 'patristocrat' ? "Patristocrat Cipher" : probType === 'atbash' ? "Atbash Cipher" : probType === 'caesar' ? "Caesar Cipher" : probType === 'xenocrypt' ? "Xenocrypt" : null)})
      let array = (probType !== 'xenocrypt' ? en_alphabet : es_alphabet).split("");

      if (probType === "aristocrat" || probType === "patristocrat" || probType === "xenocrypt") {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
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
        const a = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25][Math.floor(Math.random() * 12)];
        const b = Math.floor(Math.random() * 26);
        for (let i = 0; i < array.length; i++) {
          array[i] = en_alphabet.charAt((a * i + b) % 26);
        }
      }

      fetch('http://api.quotable.io/random')
      .then(response => response.json())
      .then(data => {
        if (probType === "aristocrat" || probType === "atbash" || probType === "caesar") {
          this.setState({plaintext: data.content.toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet});
        }
        else if (probType === "patristocrat" || probType === "affine") {
          this.setState({plaintext: data.content.replace(/[^A-Za-z]/g, "").toLowerCase(), source: data.author, mapping: array, guesses: "__________________________".split(""), checked: false, alphabet: en_alphabet});
        }
        else if (probType === "xenocrypt") {
          fetch("https://cors-anywhere.herokuapp.com/https://google-translate-proxy.herokuapp.com/api/translate?query=" + data.content + "&sourceLang=en&targetLang=es", {mode: 'cors'}).then(response => response.json())
          .then(trans => {
            console.log(trans.extract.translation)
            this.setState({plaintext: trans.extract.translation.replace('ñ','|').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('|','ñ').toLowerCase(), source: data.author, mapping: array, guesses: "___________________________".split(""), checked: false, alphabet: es_alphabet});
          });
        }
      });
    }

    nextProb() {
      if (this.props.marathon) {
        this.getProb(["aristocrat", "atbash", "caesar", "patristocrat", "affine", "xenocrypt"][Math.floor(Math.random() * 6)]);
      }
      else {
        this.getProb(this.props.type);
      }
    }

    checkProb() {
      let mistakes = 0;
      for (let i = 0; i < this.state.alphabet.length; i++) {
        if (this.state.alphabet.split("")[i].localeCompare(this.state.guesses[this.state.alphabet.indexOf(this.state.mapping[i])].charAt(0)) && this.state.plaintext.indexOf(this.state.alphabet.split("")[i]) !== -1) {
          mistakes += 1;
        }
      }

      if (mistakes < 3 && !this.state.checked) {
        this.setState({score: [this.state.score[0] + 1, this.state.score[1] + 1], checked: true})
      }
      else if (!this.state.checked) {
        this.setState({score: [this.state.score[0], this.state.score[1] + 1], checked: true})
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
      
      return <div className={`box content`} tabIndex={-1} onKeyDown={this.setLetter}>
        <h1>{this.state.probType}</h1>
        <p>{`Solve this code by ${this.state.source} which has been encoded as a${("AEIOU".indexOf(this.state.probType.charAt(0)) !== -1 ? "n" : "") + " " + this.state.probType}.`}</p>
        {
            this.state.plaintext.toLowerCase().split(" ").map((word, index) => {
                return(
                    <div class="word" onClick={this.selectLetter}>
                        {
                            word.split("").map((letter, index) => {
                                if (this.state.alphabet.indexOf(letter) !== -1) {
                                    return(
                                        <div class="letter">
                                            <div className={`${this.state.mapping[this.state.alphabet.indexOf(letter)] === this.state.selectedLetter ? "selected" : ""}`}>{this.state.mapping[this.state.alphabet.indexOf(letter)]}</div>
                                            <div>{this.state.guesses[this.state.alphabet.indexOf(this.state.mapping[this.state.alphabet.indexOf(letter)])]}</div>
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
                )
            })
        }
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
        <div className="stopwatch">
          <div className={`stopwatch-display ${parseInt(minutes) >= 50 ? "warning" : ""}`}>
            {hours} : {minutes} : {seconds} : {centiseconds}
          </div>
          <br></br>
          {this.state.timerOn === false && this.state.timerTime === 0 && (
            <button onClick={this.startTimer}>start</button>
          )}
          {this.state.timerOn === true && (
            <button onClick={this.stopTimer}>stop</button>
          )}
          {this.state.timerOn === false && this.state.timerTime > 0 && (
            <button onClick={this.startTimer}>resume</button>
          )}
          {this.state.timerOn === false && this.state.timerTime > 0 && (
            <button onClick={this.resetTimer}>reset</button>
          )}
        </div>
        <h5>{this.state.score[0] + "/" + this.state.score[1]}</h5>
        <div class="prevnext">
          <button onClick={this.checkProb}>check</button>
          <button onClick={this.nextProb}>next</button>
        </div>
        <br></br>
      </div>;
    }
    
  }