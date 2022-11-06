import { useState } from 'react'

const StatisticsLine = ({text, value}) => {
  return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
  )
}

const PercentageLine = ({text, value}) => {
  return (
      <tr>
        <td>{text}</td>
        <td>{value * 100} %</td>
      </tr>
  )
}

const Button = ({text, handleClick}) => (
  <button onClick={handleClick} >{text}</button>
)

const Statistics = (props) => {

  const total = props.good + props.bad + props.neutral
  if(total === 0) {
    return <div>No feedback given </div>
  } 
  
  else {
    
    return (
      <div>
        <table>
          <tbody>
            <StatisticsLine text={"good"} value={props.good} />
            <StatisticsLine text={"neutral"} value={props.neutral} />
            <StatisticsLine text={"bad"} value={props.bad} />
            <StatisticsLine text={"all"} value={total} />
            <StatisticsLine text={"average"} value={(props.good - props.bad) / total} />
            <PercentageLine text={"positive"} value={props.good / total} />
          </tbody>
        </table>
      </div>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => setGood(good + 1)} text={"good"} />
      <Button handleClick={() => setNeutral(neutral + 1) } text={"neutral"} />
      <Button handleClick={() => setBad(bad + 1)} text={"bad"} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App