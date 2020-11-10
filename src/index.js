import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./styles.scss";

function getRandomScheme(currentScheme, min=1, max=5) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let number = Math.floor(Math.random() * (max - min + 1)) + min;
  let str = "scheme-" + number;

  if (currentScheme === str) { str = getRandomScheme(str); }
  console.log("Current scheme: ", currentScheme);
  console.log(str);
  return  str;//Максимум и минимум включаются
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: null,
      author: null,
      isLoaded: null,
      error: null,
      scheme: "scheme-1"
    };
    this.handleNewQuote = this.handleNewQuote.bind(this);
    this.refreshQuote = this.refreshQuote.bind(this);
  }
  refreshQuote() {
    fetch("https://quotes15.p.rapidapi.com/quotes/random/?language_code=en", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "quotes15.p.rapidapi.com",
        "x-rapidapi-key": "813eac38b6mshe8e590c83f9ccb3p1a1a12jsndef3f1a6ab07",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.message) {
            this.setState({
              error: true,
              author: "",
            });
          } else {
            this.setState({
              quote: result.content,
              author: result.originator.name,
              isLoaded: true,
              error: false,
            });
          }
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  componentDidMount() {
    this.refreshQuote();
  }

  handleNewQuote() {
    this.refreshQuote();
    this.setState({
      scheme: getRandomScheme(this.state.scheme)
    });
  }

  render() {
    return (
      <div id="wrapper" className={this.state.scheme}>
        <div id="quote-box" className={this.state.scheme}>
          <div id="text-box" className="animate__fadeIn">
            {this.state.error ? (
              <span id="text">Can't load that fast. Slow down, please.</span>
            ) : (
              <div>
                <span id="text">{this.state.quote}</span>
              </div>
            )}
          </div>
          <div id="author-box">
            <span id="author">{this.state.author}</span>
          </div>
          <div id="control-panel">
            <div className="control">
              <button
                type="button"
                onClick={this.handleNewQuote}
                id="new-quote"
                className={this.state.scheme}
              >
                <a href="#" className={this.state.scheme}>
                  <i className="fas fa-sync"></i>
                </a>
              </button>
            </div>
            <div className="control">
              <button className={this.state.scheme} type="button" id="getNew">
                <a  href="twitter.com/intent/tweet" className={this.state.scheme}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a id="tweet-quote" className={this.state.scheme + ' twitter-share-button'}
                  href={"https://twitter.com/intent/tweet?text=" + this.state.quote}></a>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
serviceWorker.unregister();
