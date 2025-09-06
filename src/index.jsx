// @ts-nocheck
import { render } from "preact"

import "./style.css"
import { useState } from "preact/hooks"

export function App({ grades }) {
	const [course, setCourse] = useState(null)
	const [grade, setGrade] = useState(grades[0])

	const getPeriods = (courses) => {
		const periods = []
		courses.forEach(c => {
			if (!periods.includes(c.period)) {
				periods.push(c.period)
			}
		})
		return periods.sort()
	}

	const handleCourseHover = (course) => {
		setCourse(course)
	}

	const handleCourseLeave = () => {
		setCourse(null)
	}

	const handleGradeChange = (event) => {
		setGrade(grades[event.target.value - 1])
	}

	const clearApp = () => {
		localStorage.clear()
		window.location.reload()
	}

	return (
		<>
			<div className="header">
				<label htmlFor="grade-select">Selecione a grade: </label>
				<select id="grade-select" onChange={handleGradeChange}>
					{grades.map(g => (
						<option key={g.id} value={g.id}>{g.name}</option>
					))}
				</select>
				<button style={{ float: "right" }} onClick={clearApp}>Limpar App</button>
			</div>
			<div>
				<ul className="grade-label">
					<li className="legend-item legend--paid">Concluída</li>
					<li className="legend-item legend--cursando">Estou Cursando</li>
					<li className="legend-item legend--planned">Quero Pagar</li>
					<li className="legend-item legend--req">Requisito</li>
					<li className="legend-item legend--unlock">Desbloqueada</li>
				</ul>
			</div>
			<div>
				<h1>{grade.name}</h1>
				<section>
					<table>
						{getPeriods(grade.courses).map(p =>
							<td key={grade.id}>
								<h2>{p}</h2>
								{grade.courses.map(c => {
									if (p == c.period) {
										const itemId = grade.id + "+" + c.id
										return (
											<tr key={itemId}>
												<Course
													id={c.id}
													name={c.name}
													period={c.period}
													requisites={c.requisites}
													isRequisit={course && course.requisites.includes(c.id)}
													isUnlocked={course && c.requisites.includes(course.id)}
													onHover={handleCourseHover}
													onLeave={handleCourseLeave}
													itemId={itemId}
												/></tr>
										)
									}
								}
								)}
							</td>
						)}
					</table>
				</section>
			</div>
		</>
	)
}

function Course(props) {
	let c = localStorage.getItem(props.itemId)
	if (!c) {
		c = "0"
	}
	const [clickCount, setClickCount] = useState(parseInt(c))
	const [clicked, setClicked] = useState(parseInt(c) === 1) 			// Concluída
	const [cursando, setCursando] = useState(parseInt(c) === 2)         // Estou Cursando
	const [planned, setPlanned]   = useState(parseInt(c) === 3) 		// Quero Pagar

	const courseClick = () => {
		const newCount = (clickCount + 1) % 4	
		setClickCount(newCount)
		setClicked(newCount === 1)
		setCursando(newCount === 2)  
		setPlanned(newCount === 3)   
		localStorage.setItem(props.itemId, newCount.toString())
	}

	return (
		<div
			onMouseEnter={() => props.onHover(props)}
			onMouseLeave={props.onLeave}
			onClick={courseClick}
			className={`course ${clicked ? "clicked" : ""} ${cursando ? "cursando" : ""} ${planned ? "second-click" : ""} ${props.isRequisit ? "requisit" : ""} ${props.isUnlocked ? "unlocked" : ""}`}
		>
			<h3>{props.name}</h3>
		</div>
	)
}

import _ads from "./data/ads_ifba.json"
import _ccNew from "./data/cc_new.json"
import _ccOld from "./data/cc_old.json"
import _eeNew from "./data/ee_new.json"

const _grades = [{id: 1, name: "Análise e Desenvolvimento de Sistemas - IFBA", courses: _ads},
{ id: 2, name: "Ciência da Computação - Novo", courses: _ccNew },
{ id: 3, name: "Ciência da Computação - Antigo", courses: _ccOld },
{ id: 4, name: "Engenharia Elétrica - Novo", courses: _eeNew }
]

render(<App grades={_grades} />, document.getElementById("app"))