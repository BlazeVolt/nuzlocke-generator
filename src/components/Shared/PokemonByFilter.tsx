import * as React from 'react';
import { Tooltip, Position } from '@blueprintjs/core';
import { Pokemon } from 'models';
import { PokemonIcon } from 'components/PokemonIcon';
import { sortPokes } from 'utils';
import { connect } from 'react-redux';
import { editPokemon } from 'actions';

const Grid = (({ team, filterFunction }: {
    team: Pokemon[],
    filterFunction: (value: Pokemon, index: number, array: Pokemon[]) => boolean
}) => {
    return (
            <>{team
                .filter(filterFunction)
                .sort(sortPokes)
                .map((poke, index) => (
                    <Tooltip content={poke.nickname || ''} position={Position.TOP}>
                        <PokemonIcon
                            id={poke.id}
                            species={poke.species}
                            forme={poke.forme}
                            shiny={poke.shiny}
                            gender={poke.gender}
                            customIcon={poke.customIcon}
                        />
                    </Tooltip>
            ))}</>
    );
});


export interface PokemonByFilterProps {
    team: Pokemon[];
    filter?: string | undefined;
    editPokemon: editPokemon;
}

export class PokemonByFilterBase extends React.Component<PokemonByFilterProps> {
    public state = {
        team: [],
    };

    public componentWillMount() {
        this.setState({ team: this.props.team });
    }

    public componentWillReceiveProps(nextProps, prevProps) {
        this.setState({ team: nextProps.team });
    }

    private getFilterFunction(filter) {
        if (filter != null) return poke => poke.status === filter;
        if (filter == null) return poke => true;
        return poke => true;
    }

    public render() {
        const { team, filter } = this.props;

        return <Grid filterFunction={this.getFilterFunction(filter)} team={this.state.team} />;
    }
}

export const PokemonByFilter = connect(
    null,
    {
        editPokemon
    }
)(PokemonByFilterBase);