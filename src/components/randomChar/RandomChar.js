import { Component  } from 'react';
import mjolnir from '../../resources/img/mjolnir.png';
import './randomChar.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMsg/ErrorMsg';

class RandomChar extends Component {
state = {
    char: {},
    loading: true,
    error: false,
}

componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 3000);
}

// componentWillUnmount() {
//     clearInterval(this.timerId);
// }

onError = () => {
    this.setState({
        loading: false,
        error: true
    })
}

marvelService = new MarvelService();

onCharLoaded = (char) => {
    if (char.description === '') {
        char.description = 'lalala';
    }
    if (char.description.length > 150) {
        char.description = char.description.substring(0, 150)+"...";
    }
    this.setState({char, loading: false});
}

updateChar = () => {
    const id = Math.floor(Math.random() * (1011400-1011000) + 1011000)
    this.marvelService
        .getCharcter(id)
        .then(this.onCharLoaded)
        .catch(this.onError)
}

btnUpdate = () => {
    this.setState({
        loading: true,
        error: false,
    })
    this.updateChar();
}



render() {
    const {char, loading, error} = this.state;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spiner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;
        return (
        <div className="randomchar">
            {errorMessage}
            {spiner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main">
                    <div onClick={this.btnUpdate} className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className='randomchar__img' style={imgStyle}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
             {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )

}

export default RandomChar;