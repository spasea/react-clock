import React, { Component } from 'react'
import Hand from './Hand'

import SmallHand from './img/small_hand.png'
import BigHand from './img/big_hand.png'

import './index.sass'

class App extends Component {
  HANDS = {
    BIG_HAND: '--big-hand-rotate',
    SMALL_HAND: '--small-hand-rotate',
  }

  state = {
    hours: 1,
    minutes: 1,
    size: 800,
    presets: [],
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setHandAngle = (property, angle) => {
    document.documentElement.style.setProperty(property, `${angle}deg`)
  }

  saveState = (newState, cb = () => '') => {
    this.setState(newState, () => {
      cb()

      localStorage.setItem('state', JSON.stringify(this.state))
    })
  }

  generateRandomTime = () => {
    const hours = this.getRandomInt(1, 12)
    const minutes = this.getRandomInt(0, 59)

    this.saveState({
      hours,
      minutes
    }, this.updateTime)
  }

  updateTime = () => {
    const {
      hours,
      minutes,
    } = this.state

    const hoursAngle = 360 / 12 * hours + minutes * 28 / 60 - 90
    const minutesAngle = 360 / 60 * minutes - 90

    this.setHandAngle(this.HANDS.SMALL_HAND, hoursAngle)
    this.setHandAngle(this.HANDS.BIG_HAND, minutesAngle)
  }

  handleHours = e => {
    this.saveState({
      hours: e.target.value
    }, this.updateTime)
  }

  handleMinutes = e => {
    this.saveState({
      minutes: e.target.value
    }, this.updateTime)
  }

  handleSize = e => {
    const size = e.target.value

    this.saveState({
      size
    }, () => {

      this.updateSize(size)
    })
  }

  updateSize = size => document.documentElement.style.setProperty('--clock-size', `${size}px`)

  savePreset = () => {
    const {
      hours,
      minutes,
      presets,
    } = this.state

    this.saveState({
      presets: [
        ...presets.filter(preset => preset.id !== `${hours}:${minutes}`),
        {
          id: `${hours}:${minutes}`,
          hours,
          minutes,
        }
      ]
    })
  }

  applyPreset = id => {
    const {
      presets,
    } = this.state

    const preset = presets.find(preset => preset.id === id)

    if (!preset) {
      return
    }

    this.saveState({
      hours: preset.hours,
      minutes: preset.minutes
    }, this.updateTime)
  }

  removePreset = id => {
    const {
      presets,
    } = this.state

    this.saveState({
      presets: presets.filter(preset => preset.id !== id)
    })
  }

  componentDidMount() {
    const state = localStorage.getItem('state')

    if (!state) {
      this.generateRandomTime()

      return
    }

    this.setState(JSON.parse(state), () => {
      this.updateTime()
      this.updateSize(this.state.size)
    })
  }

  render() {
    const {
      hours,
      minutes,
      size,
      presets,
    } = this.state

    return (
      <div className="wrapper">
        <div className="clock-bg">
          <Hand image={SmallHand} isSmall={true}/>
          <Hand image={BigHand}/>
        </div>

        <div className="input-wrapper">
          <label>
            Scale
            <input type="number" onChange={this.handleSize} value={size} step={50}/>
          </label>
          <label>
            Hours
            <input type="number" onChange={this.handleHours} value={hours} min={1} max={12}/>
          </label>
          <label>
            Minutes
            <input type="number" onChange={this.handleMinutes} value={minutes} min={0} max={59}/>
          </label>

          <button onClick={this.generateRandomTime}>Generate</button>
          <button onClick={this.savePreset}>Save preset</button>
        </div>

        <div className="input-wrapper">
          {
            presets.map(preset =>
              <div className="time-preset" key={preset.id}>
                hours: {preset.hours};
                minutes: {preset.minutes}

                <button onClick={() => this.applyPreset(preset.id)}>Apply</button>
                <button onClick={() => this.removePreset(preset.id)}>Remove</button>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App
