import * as React from 'react';
import { connect } from 'react-redux';

import { Pokemon } from 'models';
import { getBackgroundGradient } from './getBackgroundGradient';
import { getGenderElement } from './getGenderElement';
import { movesByType } from './movesByType';
import { typeToColor } from './typeToColor';
import { addForme, getSpriteIcon, speciesToNumber } from 'utils';

import { selectPokemon } from 'actions';

export const getMoveType = move => {
    for (const type in movesByType) {
        if (movesByType.hasOwnProperty(type)) {
            if (
                movesByType[type].some((value, index) => {
                    return move === value;
                })
            )
                return type;
        }
    }

    return 'Normal';
};

const generateMoves = moves => {
    return moves.map((move, index) => {
        move = move.trim();
        const type = getMoveType(move);
        return (
            <div
                key={index}
                className={`move ${type}-type ${move.length >= 12 ? 'long-text-move' : ''}`}>
                {move}
            </div>
        );
    });
};

export const TeamPokemonBase = (props: Pokemon & { selectPokemon } & { style: any }) => {
    const poke = props;
    const moves =
        poke.moves == null ? (
            ''
        ) : (
            <div className={`pokemon-moves ${props.style.movesPosition}`}>
                {generateMoves(poke.moves)}
            </div>
        );
    const getImage = (): string => {
        if (poke.customImage) {
            return `url(${poke.customImage})`;
        }
        if (props.style.teamImages === 'sugimori') {
            return `url(https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(speciesToNumber(poke.species) || 0).toString().padStart(3 , '0')}.png)`;
        }
        return `url(img/${(
            addForme(poke.species.replace(/\s/g, ''), poke.forme) || 'missingno'
        ).toLowerCase()}.jpg)`;
    };
    const getFirstType = poke.types ? poke.types[0] : 'Normal';

    const addProp = (item) => {
        const propName = `data-${item.toLowerCase()}`;
        if (item === 'type') return { [propName]: poke[item].join(' ') };
        if (poke[item] == null || poke[item] === '') return {  };
        return { [propName]: poke[item].toString() };
    };

    const dataKeys = ['id', 'position', 'species', 'nickname', 'status', 'gender', 'level', 'metLevel', 'nature', 'ability', 'item', 'types', 'forme', 'moves', 'causeOfDeath', 'shiny', 'champion', 'num', 'wonderTradedFor', 'mvp', 'customImage'];
    const data = dataKeys.reduce((prev, curr) => {
        return { ...prev, ...addProp(curr) };
    }, {});

    if (props.style.minimalTeamLayout) {
        return (
            <div className='pokemon-container minimal' {...data}>
                <div
                    style={{
                        backgroundImage: getImage(),
                    }}
                    className={`pokemon-image ${(poke.species || 'missingno').toLowerCase()} ${
                        props.style.imageStyle === 'round' ? 'round' : 'square'
                    }`}
                />
                <div className='pokemon-info'>
                    <div className='pokemon-info-inner'>
                        <span className='pokemon-nickname'>{poke.nickname}</span>
                        <span className='pokemon-name'>{poke.species}</span>
                        {poke.level ? <span className='pokemon-level'>lv. {poke.level}</span> : null}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='pokemon-container' {...data}>
            <div
                role='presentation'
                onClick={e => props.selectPokemon(poke.id)}
                className={props.style.imageStyle === 'round' ? 'round' : 'square'}
                style={{
                    cursor: 'pointer',
                    background: props.style.teamPokemonBorder ? getBackgroundGradient(
                        poke.types != null ? poke.types[0] : '',
                        poke.types != null ? poke.types[1] : '',
                    ) : 'transparent',
                }}>
                <div
                    style={{
                        backgroundImage: getImage(),
                    }}
                    className={`pokemon-image ${(poke.species || 'missingno').toLowerCase()} ${
                        props.style.imageStyle === 'round' ? 'round' : 'square'
                    }`}
                />
            </div>
            {poke.item == null || poke.item === '' ? null : (
                <div
                    className={`pokemon-item ${
                        props.style.imageStyle === 'round' ? 'round' : 'square'
                    }`}
                    style={{
                        borderColor: typeToColor(getFirstType),
                    }}>
                    <img
                        alt={poke.item}
                        src={`http://www.serebii.net/itemdex/sprites/${poke.item
                            .toLowerCase()
                            .replace(/\s/g, '')}.png`}
                    />
                </div>
            )}
            <div className='pokemon-info'>
                <div className='pokemon-info-inner'>
                    <span className='pokemon-nickname'>{poke.nickname}</span>
                    <span className='pokemon-name'>{poke.species}</span>
                    {getGenderElement(poke.gender)}
                    {poke.level ? <span className='pokemon-level'>lv. {poke.level}</span> : null}
                    <br />
                    {poke.met && poke.metLevel ? (
                        <span className='pokemon-location'>
                            {poke.met === 'Starter' ? poke.met : `Met on ${poke.met}`}, from lv.{' '}
                            {poke.metLevel}
                        </span>
                    ) : null}
                    <br />
                    {poke.nature && poke.nature !== 'None' ? (
                        <span className='pokemon-nature'>
                            <strong>{poke.nature}</strong> nature
                        </span>
                    ) : null}
                    <br />
                    {poke.ability ? <span className='pokemon-ability'>{poke.ability}</span> : null}
                </div>
                {moves}
            </div>
        </div>
    );
};

export const TeamPokemon = connect(
    (state: any) => ({
        style: state.style,
    }),
    {
        selectPokemon,
    },
)(TeamPokemonBase as any);
