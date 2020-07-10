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
        alphabet: en_alphabet,
        questions: [],
        maracheck: 0,
        name: "",
        record: false
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
      console.log(event.key)
      if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
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

      fetch('https://api.quotable.io/random')
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
        this.checkProb();
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

      if (this.props.marathon && !this.state.checked) {
        let currq = this.state.questions;
        currq.push({question: this.state.plaintext, mistakes: mistakes, time: Math.floor(this.state.timerTime / 1000), type: this.props.type})
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
          score: this.state.score[0]
        });
      }
      this.setState({maracheck: 2})
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
            <p>marathon mode gives you randomized question types from the ones available. if you select the record option, your results will be recorded and sent to a server where others can view your results. in short, it's an easy way to do codebusters tryouts online. good luck! ヽ(*・ω・)ﾉ</p>
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
            <p>we pride ourselves on transparency. if you selected record, go <a href="https://codebusters-406e6.firebaseio.com/results.json" target="_blank">here</a> to check your results. or <a href="https://github.com/mobiusdonut/codebusters" target="_blank">here</a> to check out the source code.</p>
          </div>
        )}
      </div>;
    }
    
  }