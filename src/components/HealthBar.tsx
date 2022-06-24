import React from 'react';
import { useAppSelector } from '../app/hooks';
import HealthBarBlock from './HealthBarBlock';
import _ from 'lodash'

function HealthBar () {
  const characterHealth = useAppSelector((state) => state.character.health)
  
  return (
    <div id="healthBarContainer" className="healthBarContainer">
        {_.times(characterHealth, i => <HealthBarBlock key = {i} />)}
    </div>
  );
}

export default HealthBar