import './charInfo.scss';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMsg/ErrorMsg';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    
    const marvelService = new MarvelService();



    useEffect(() => {
        updateChar()
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService.getCharcter(charId)
            .then(onCharLoaded)
            .catch(onError);


    }

    const onCharLoaded = (char) => {
        setLoading(false);
        setChar(char);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

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