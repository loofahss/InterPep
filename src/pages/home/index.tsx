import React from 'react'
import './index.less'

const Home = () => {
	const handleScroll = () => {
		window.scrollBy({
			// top: -window.innerHeight * 0.4,
			top: window.innerHeight * 0.55,
			behavior: 'smooth'
		})
	}

	return (
		<div className='container'>
			<div className='headline'>
				<h1>Background</h1>
			</div>
			<div className='body-con'>
				The development of this website offers a valuable resource for
				researchers across multiple fields by providing an intuitive platform
				for exploring{' '}
				<span className='highlight'>protein-peptide interactions</span>. By
				allowing users to quickly identify peptides with strong binding
				affinities to proteins, or vice versa, this tool can significantly
				expedite the initial screening process in drug discovery and
				development.
			</div>
			<button className='scroll-button' onClick={handleScroll}>
				Here you can see some examples...
				<div className='arrows'>
					<span>&#9660;</span>
					<span>&#9660;</span>
					<span>&#9660;</span>
				</div>
			</button>
			<div className='headline'>
				<h1>Examples</h1>
			</div>
			<div className='image-container'>
				<img
					src='./pdbData_1.gif'
					// controls
					alt='Protein 3D Structure 2'
					style={{ maxWidth: '50%', height: 'auto' }}
				/>
				<div style={{ marginLeft: '20px' }}>
					<div className='discription'>
						&nbsp;&nbsp;&nbsp;&nbsp;This is the 3D structure of a
						protein-peptide pair with strong interactions (rendered using
						PyMOL). The highlighted region represents the peptide, clearly
						demonstrating its close binding with the protein in the predicted
						structure.
						<br />
					</div>
				</div>
			</div>
			<div className='image-container'>
				<img
					src='./pdbData_28.gif'
					alt='Protein 3D Structure 2'
					style={{ maxWidth: '50%', height: 'auto' }}
				/>
				<div style={{ marginLeft: '20px' }}>
					<div className='discription'>
						&nbsp;&nbsp;&nbsp;&nbsp;In contrast, this is the 3D structure of a
						protein-peptide pair with weak interactions. The peptide is located
						further away from the protein, indicating a lower binding affinity
						between the two molecules.
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
