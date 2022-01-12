import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import { Component  } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMsg/ErrorMsg';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    }
    
    marvelService = new MarvelService();


    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }

    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService.getCharcter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);


    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false});
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
    render() {
        const {char, loading, error} = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage/> : null;
        const spiner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
            {skeleton}
            {errorMessage}
            {spiner}
            {content}
            </div>
                )
}
}


const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    const comicsList = comics.length > 0 ? <ComicsList comics={comics}/> : <NoComics/>
    return (
        <>
         <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
            {comicsList}
            </ul>
        </>
    )
}

const ComicsList = ({comics}) => {
    return (
        comics.map((item, i) => {
            if (i <= 10) {
             return (
                    <li className="char__comics-item"
                        key={i}>
                       {item.name}
                    </li>
                )
            } 
     })
    )
}

const NoComics = () => {
    return (
        <li className="char__comics-item"
        >
       Нет доступных комиксов
    </li>
    )
}

export default CharInfo;