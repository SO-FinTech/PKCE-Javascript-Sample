import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import axios from 'axios';
import base64 from 'base-64';
import './index.css';

const appTypes = [
  { label: "CODE", value: 'Code' },
  { label: "PKCE", value: "PKCE" },
  { label: "Implicit", value: "Implicit" }
];

const languages = [
  { label: "CSharp", value: "CSharp" },
  { label: "Javascript", value: "Javascript" },
  { label: "Java", value: "Java" }
];

const extensions = { "CSharp": "cs", "Java": "java", "Javascript": "js" };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: null,
      selectedAppType: null,
      sample: null,
      link: null
    };
  }

  getGitSamples = () => {

    const dataUrl="http://localhost/developer/samples";

    if (!this.state.selectedAppType || !this.state.selectedLanguage) {
      this.setState({ sample: 'Invalid App Type & Language Pair!' });
      return;
    }
    const appType = this.state.selectedAppType.label;
    const language = this.state.selectedLanguage.label;
    const filePath = 'https://api.github.com/repos/threepotatoes/' + appType + '-' + language + '-Sample/contents/Program.' + extensions[language];
    const link = 'https://github.com/threepotatoes/' + appType + '-' + language + '-Sample/archive/master.zip';
    this.setState({ link: link }, () => {
      axios.get(filePath)
        .then(
          res => {
            if (res.status === 200) {
            this.setState({ sample: base64.decode(res.data.content) });
            } else {
              this.setState({ sample: "To be done." });
            }
          },
          error => this.setState({ sample: "To be done." }));
    })
  };

  handleAppTypeChange = appType => {
    this.setState({ sample: 'Loading....' });
    const oldType = this.state.selectedAppType;
    this.setState({ selectedAppType: appType }, () => {
      if (!oldType || oldType.label !== appType.label) {
        this.getGitHubContent();
      }
    });
  };

  handleLanguageChange = language => {
    this.setState({ sample: 'Loading....' });
    const oldLanguage = this.state.selectedLanguage;
    this.setState({ selectedLanguage: language }, () => {
      if (!oldLanguage || oldLanguage.label !== language.label) {
        this.getGitHubContent();
      }
    });
  };

  handleClick = () => { alert('Copied'); };

  handleDownload = () => {
    window.open(this.state.link, '_blank');
  };

  render() {
    const { selectedAppType } = this.state;
    const { selectedLanguage } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <Select value={selectedAppType} options={appTypes} onChange={this.handleAppTypeChange} />
          </div>
          <div className="col-md-4"></div>
        </div>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <Select value={selectedLanguage} options={languages} onChange={this.handleLanguageChange} />
          </div>
          <div className="col-md-4"></div>
        </div>
        <h3> Code Sample</h3>
        <div className="sample">
          <code>{this.state.sample}</code>
        </div>
        <div>
          {this.state.link && this.state.sample !== "To be done." ? <h3><a href={this.state.link}>Download Sample Repo</a></h3> : null}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
