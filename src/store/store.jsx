import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { useGLTF } from '@react-three/drei'

import * as THREE from 'three'

const ringNames = { ring_2: 'Experts', ring_3: 'Source', ring_4: 'Support', ring_5: 'Technology', ring_6: 'Welfare' }
// const pageCopy = {
// 	Welfare: {
// 		subTitle: 'Environment + Park',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	},
// 	Support: {
// 		subTitle: 'Fleet Maintenance + Customer Portal',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	},
// 	Experts: {
// 		subTitle: 'The Team',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	},
// 	Technology: {
// 		subTitle: 'Smart + Tyres',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	},
// 	Source: {
// 		subTitle: 'Assets + Finance',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	},
// 	Experts: {
// 		subTitle: 'The Team',
// 		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.',
// 		content: [
// 			{ title: 'James Smith', subtitle: 'CEO', description: 'description', images: ['1.jpg'], cta: '' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['5.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['1.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['2.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['3.jpg'], cta: 'google.com' },
// 			{ title: 'Title', subtitle: 'subtitle', description: 'description', images: ['4.jpg'], cta: 'google.com' }
// 		]
// 	}
// }
const sectionCopy = {
	Welfare: {
		subTitle: 'Environment + Park',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	},
	Support: {
		subTitle: 'Fleet Maintenance + Customer Portal',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	},
	Experts: {
		subTitle: 'The Team',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	},
	Technology: {
		subTitle: 'Smart + Tyres',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	},
	Source: {
		subTitle: 'Assets + Finance',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	},
	Experts: {
		subTitle: 'The Team',
		description: 'Meet the experts that deliver your total transport solution, request a meeting with them here today or when suits you.'
	}
}

const pageCopy = [
	{
		Category: 'Experts',
		Title: 'JAMES SMITH',
		Subtitle: 'CEO',
		Description:
			"James Smith, CEO of Hireco, is a seasoned professional with over 30 years of experience in the transport industry. He started his career at the age of 18 and has worked at several rental businesses before joining Hireco as Managing Director at the age of 30. Under his leadership, Hireco has seen significant growth, increasing their assets from 1000 to 8000 since 2006. Today, the company has a turnover of over £60m and is transforming the way transport companies lease assets. James' expertise and leadership have played a crucial role in the company's success, and his vision for the future continues to drive Hireco forward.",
		CTA: 'Linkedin, email, send message?',
		'Image/Videos': 'EXPERTS_JAMES SMITH.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Tim Gibson',
		Subtitle: 'Sales Director',
		Description:
			"Tim Gibson is a well-respected sales director who has spent the last 17 years of his career at Hireco, a leading asset and equipment sourcing company. Throughout his time at Hireco, Tim has been instrumental in driving the company's growth and success, helping to establish it as a leading provider of cost-effective and efficient asset solutions for businesses.\n\nTim's career in sales spans over 25 years, and he has built a reputation as a highly skilled and knowledgeable professional in his field. He has a wealth of experience in sales strategy, account management, and customer service, and has worked with a diverse range of clients across various industries.\n\nAt Hireco, Tim has been responsible for managing the sales team and driving revenue growth for the company. He has a proven track record of successfully identifying new business opportunities and building strong relationships with clients, helping to establish Hireco as a trusted partner in the asset and equipment sourcing industry.\n\nTim's dedication to his work and his commitment to providing exceptional customer service have earned him the respect and admiration of his colleagues and clients alike. He is known for his strategic thinking, attention to detail, and ability to deliver results, and has been a key contributor to Hireco's continued success.\n\nIn conclusion, Tim Gibson is a sales director with over 25 years of experience in his field, and has spent the last 17 years at Hireco helping to drive the company's growth and success. His expertise and dedication to his work have earned him a reputation as a highly skilled and respected professional in his field, and he is a valuable asset to Hireco and its clients.\n",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_TIM GIBSON.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Jason Chipchase',
		Subtitle: 'UK Contracts Manager',
		Description:
			'Jason Chipchase recently joined Hireco from Krone trailer manufacturing as our senior contracts manager. His experience in both the military and transport industry has provided him with a unique skill set that enables him to effectively manage contracts and provide tailored solutions for his clients. At Hireco, he is able to use his expertise to help businesses find the right assets and transportation solutions to meet their specific needs. With his commitment to customer satisfaction and attention to detail, Jason is a valuable asset to the Hireco team.\n\n',
		CTA: 'Linkedin, email, Watsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_JASON CHIPCHASE.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Paul Jeferry',
		Subtitle: 'UK Operations  Manager',
		Description:
			"Paul Jeffery is an experienced operations manager at Hireco, With over 15 years of experience in the logistics and transportation industry, Paul has a proven track record of delivering exceptional results through his strong leadership, strategic planning, and operational excellence.\n\nAs the UK operations manager at Hireco, Paul is responsible for overseeing the day-to-day operations of the company's fleet of commercial vehicles across multiple locations in the UK. His role involves managing a team providing excellent customer service to clients.\n\nPaul's expertise in logistics and transportation has been integral to Hireco's success in the UK market. He has a deep understanding of the complexities of the industry, including regulations, compliance, and safety requirements. This knowledge has allowed him to develop and implement effective operational processes that ensure Hireco's fleet is always operating at peak efficiency.\n\nIn addition to his operational responsibilities, Paul is also a key member of Hireco's management team. He works closely with other senior leaders in the company to develop and execute strategic initiatives that drive growth and increase profitability. His ability to think strategically and his strong business acumen have helped Hireco stay ahead of the competition and continue to expand its market share in the UK.\n\nOverall, Paul Jeffery is a highly skilled and experienced operations manager who brings a wealth of expertise to Hireco. His leadership, strategic vision, and operational excellence have been instrumental in the company's success, and he is highly respected within the logistics and transportation industry in the UK.\n\n",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_PAUL JEFFERY.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: '',
		Title: '',
		Subtitle: '',
		Description: '',
		CTA: '',
		'Image/Videos': '',
		'Comments (Not extracted)': ''
	},
	{
		Category: 'Experts',
		Title: 'Tim McCarthy',
		Subtitle: 'Financial Director',
		Description:
			'Tim McCarthy is the finance director of Hireco. With over 15 years of experience in the financial services industry, Tim is exceptionally qualified to oversee the company’s financial operations.\n\nTim began his career as an accountant for a large international bank, where he was quickly promoted to financial analyst and then financial controller. After several years at the bank, Tim joined Hireco as the head of finance.\n\nAt Hireco, Tim has had a major impact, helping to lead the company through various financial times. He has been instrumental in developing innovative strategies to reduce costs and increase efficiency. He has also successfully negotiated multiple bank loan agreements and successfully overseen the company’s large-scale expansion.\n\nTim is passionate about helping Hireco succeed and is always looking for new ways to optimize the company’s operations. With his expertise and dedication, Tim is the driving force behind Hireco’s financial success.\n',
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_TIM MCARTHY.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'SCOTT McMINIGLE\n\n',
		Subtitle: 'Head of New Fleet UK',
		Description:
			"Scott McMinigle started out renting cars and vans, he made moved into truck and trailer in the 90’s. With over 30 years of experience in the transport industry, Scott brings a wealth of knowledge and expertise to Hireco. His attention to detail and ability to match assets with clients' requirements has been instrumental in the company's growth and success. Scott's role in the new fleet department is critical to ensuring that Hireco continues to provide high-quality assets to their clients, and his contributions have helped to establish Hireco as a leading player in the industry.\n\n",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_SCOTT MCMINIGLE.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Karen McChesney',
		Subtitle: 'Head of Credit & Commercial Finance',
		Description:
			"Karen McChesney is a highly skilled professional with a wealth of knowledge and experience in finance. Karen's attention to detail and analytical skills have been instrumental in ensuring accuracy and efficiency in financial reporting and budget management. Karen's dedication and commitment to Hireco and it’s clients is a big contribution to our success.",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': 'EXPERTS_KAREN McCHESNEY.jpg',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Tim Attwood',
		Subtitle: 'Head of Engineering & Compliance',
		Description:
			'Strong attributes in communications with both clients and staff, complimented by a natural character of being a self-starter with good initiative and awareness.\n\nA seasoned professional who balances decision making with day-to-day operational concerns\n\nPossessing a demonstrated talent for building team work ,also motivating and developing people to improve the efficiency and profitability of the company\n\nSuccessful history managing fast business growth whilst maintaining operational excellence\n\nSpecialties: A highly motivated individual possessing a unique blend of expertise and experience in Client relations, Operations, Engineering and Senior Management. Results oriented with strong leadership skills, underpinned by a clear understanding of strategic, organisational and people issues gained through prior senior client focused roles. An excellent communicator at all levels. I am a reliable, trustworthy facilitator who will deliver tangible benefits and drive change.\n\nCORE EXECUTIVE MANAGEMENT SKILLS\n \n• Managing fast business growth whilst maintaining operational excellence \n• Demonstrate initiatives with supply chain cost reductions whilst maintaining service.\n• Strategic planning and implementation\n• Finance, budgeting, cash flow management and Administration\n• Exceeding goals and objectives and implementing department KPI’s\n• Building and maintaining professional relationships\n• Team development and training and implementing Individual Key objectives.\n',
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': '',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Paul Jackson',
		Subtitle: 'MD Used Trailers',
		Description:
			"Paul Jackson is an experienced Asset Disposal Manager at Hireco with over 30 years of experience in the industry. He is a highly skilled and knowledgeable professional who is dedicated to helping businesses dispose of their assets in the most efficient and cost-effective way possible.\n\nPaul has a deep understanding of the asset disposal process, and he knows how to navigate the complexities of the industry to ensure that his clients get the best possible outcomes. He has a proven track record of success, having helped Hireco dispose of their assets in a way that maximizes their return on investment.\n\nIn his role as Asset Disposal Manager, Paul is responsible for overseeing all aspects of the asset disposal process, from initial assessment and valuation to final sale and disposal. He works closely with clients to understand their unique needs and objectives, and he develops customized disposal strategies that are tailored to each client's specific requirements.\n\n\nIn addition to his expertise in asset disposal, Paul is also a highly skilled communicator and team leader. He is able to build strong relationships with clients, colleagues, and stakeholders, and he is committed to delivering outstanding customer service and support.\n\nOverall, Paul is a highly respected and trusted asset disposal professional who is dedicated to helping businesses achieve their goals. His extensive experience, deep knowledge, and commitment to excellence make him an invaluable asset to Hireco and its clients.\n\n",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': '',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Tom Baker',
		Subtitle: 'Asset Performance Manager',
		Description: 'Experienced Sales Manager with a demonstrated history of working in the transportation and haulage industry. Strong sales professional with a Bachelor’s Degree focused in Motorsports Engineering and Technology from Staffordshire University.',
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': '',
		'Comments (Not extracted)': 'KF/LG to film w/c 12.6 latest\nStill to be used for now'
	},
	{
		Category: 'Experts',
		Title: 'Chris Heather',
		Subtitle: 'UK Rentals Manager',
		Description:
			"Chris Heather is an experienced professional in the rental industry, having started his career in the field straight out of school. With years of expertise under his belt, Chris is an expert in rental and runs our rental fleet, ensuring that our clients' short-term needs are met with the right stock levels.\n\nChris is passionate about his work and has a deep understanding of the rental industry. He is well-versed in the needs of clients across various industries and works tirelessly to ensure that our rental fleet is equipped with the right equipment to meet their needs.\n\nOne of Chris's key strengths is his ability to match clients' short-term rental needs with the right stock levels. He understands that every client's needs are unique, and works closely with them to ensure that the rental equipment they need is available when they need it.\n\nChris's dedication to his work and his commitment to providing exceptional customer service have earned him the respect and admiration of his colleagues and clients alike. He is known for his attention to detail, his ability to deliver results, and his willingness to go above and beyond to meet his clients' needs.\n\nIn conclusion, Chris Heather is an expert in rental with years of experience in the field. He is passionate about his work and has a deep understanding of the industry and the needs of his clients. He is a valuable asset to our rental fleet, and his dedication to providing exceptional customer service makes him an invaluable partner for any business in need of short-term rental equipment.\n",
		CTA: 'Linkedin, email, whatsapp message? request meeting?',
		'Image/Videos': '',
		'Comments (Not extracted)':
			'Still to be used for nowThese can be clicked as well as the actual CTA for TRAILER, TRUCK ETC. BUT these specific images will give you the detail on that specific model of asset - nothing heavy, just name, model, manufacturer otpiion and as always the ability to bespoke build/customise to your fleets needs'
	},
	{
		Category: 'Source',
		Title: 'TRAILER',
		Subtitle: '',
		Description:
			'We are the trailer experts – the largest purchaser of trailers in the UK. But we go beyond the trailer. \n\nEvery trailer is fitted with the latest smart technology, allowing us to be your digital transport manager.\n\nUltimately we want to deliver real time reporting through and one cost for your PPK.\n\nWhatever your sector or specialism, we can customise trailers to suit your business from the latest TK Advancer Fridges to Skels and Curtainsiders. From the best brands in the business, Dennison, Krone, SDC and beyond. \n\nWant to know more? Click here to Contact us now for a meeting with one of our experts today, or whenever suits you.',
		CTA: '> TRUCK\n> VAN\n> FINANCE',
		'Image/Videos': '',
		'Comments (Not extracted)': 'Pics (one or two pics of key trailers tbc) and testimonial (RS SMITH? or Woodlands) video to follow'
	},
	{
		Category: 'Source',
		Title: 'TRUCK',
		Subtitle: '',
		Description:
			'The Smart Choice. \n\nKeep your fleet up to date with the latest innovations from the greatest brands. \n\nEvery Hireco truck is equipped with the latest smart tech, helping you maximise uptime. Especially when coupled with our service and maintenance packages, giving you the very best and latest tech coupled with the best engineering expertise the industry has to offer.\n\nWant to know more? Click here to Contact us now for a meeting with one of our experts today, or whenever suits you.',
		CTA: '(click through options)\n> TRAILER\n> VAN\n> FINANCE',
		'Image/Videos': '',
		'Comments (Not extracted)': ''
	},
	{
		Category: 'Source',
		Title: 'VAN or LCV',
		Subtitle: '',
		Description:
			'Hireco delivers industry leading light commercial vehicle hire. VW, Mercedes, MAN, Peugeot. Construction, Utilities or education. Whatever your LCV requirements, we can source a single van or an entire fleet - bespoke to your precise specs.    The right van solution for you. We understand the landscape is changing within the LCV market and we want to help your business adapt to those changes. We have the expertise to source any vehicle, in any number with flexible financing to match - including fixed monthly payments which allow you to manage your fleet costs effectively. Talk to Hireco to find out how we are helping companies across the UK change for the better.',
		CTA: '(click through options)\n> TRAILER\n> TRUCK\n> FINANCE',
		'Image/Videos': 'MULTIPLE VANS.MP4, WELFARE VAN ',
		'Comments (Not extracted)': 'Video loop of WELFARE VAN walk around edited & MULTIPLE VANS.MP4'
	},
	{
		Category: 'Source',
		Title: 'FINANCE',
		Subtitle: 'Your expert, flexible financial partner',
		Description:
			"Fixed or flexible? The assets you need financed in a way that works for your business. Yes, we provide the asset your business needs. But we can also manage their effective utilisation, maximising performance, uptime and value. We can then replace an asset at the right time before it becomes outdated, obsolete or an expensive drain on your business's finances and ambitions.\n\nOur expert funders are happy to talk to you about finance on assets you are purchasing or leasing from Hireco. Hireco are also experts in sale and leaseback schemes allowing your business to free up cash tied up in assets. We can lease back your fleet inclusive of maintenance allowing you to do what you do best.   Talk to one of our experts today.",
		CTA: '(click through options)\n> TRAILER\n> TRUCK\n> VAN.  Talk to one of our finance experts today > Tim MCCarthy.   > Karen McChesney',
		'Image/Videos': '',
		'Comments (Not extracted)': ''
	},
	{
		Category: '',
		Title: '',
		Subtitle: '',
		Description: '',
		CTA: '',
		'Image/Videos': '',
		'Comments (Not extracted)': ''
	},
	{
		Category: 'Technology',
		Title: 'Technology',
		Subtitle: 'Smarter technology',
		Description: '',
		CTA: '',
		'Image/Videos': '230203 - 2024 READY - v6.mp4, 221106 - Hireco Deal Social Posts_v2.mp4, Hireco - Brand Film & Tracking System Films Combined (H.264).mp4',
		'Comments (Not extracted)': 'These CTA with the EBPMS etc, we need to have the detail appear in another window, like an in-video? that shows the explanation and benefits of the Acronym, but without going to another page everytime - maybe scrolling info???'
	},
	{
		Category: 'Technology',
		Title: 'EBPMS, TPMS, DTC, TELEMATICS TRACKING',
		Subtitle: '',
		Description:
			'IMPROVE THE PERFORMANCE, SAFETY AND COST-EFFICIENCY OF YOUR FLEET\n\nThrough our next-generation digital transport solution you can:\n\n•        Reduce your brake test requirements by up to 75%\n•        Decrease downtime and increase MPG with real-time tyre updates\n•        Fix HGV faults without requiring roadside assistance\n•        Actively monitor the location and performance of your vehicles and drivers\n\nHere’s how…\n\n\nELECTRONIC BRAKING PERFORMANCE MONITORING SYSTEM (EBPMS) \n\nReduce your brake test requirements by up to 75%\n\nWhat is it and how does it work? \nThe EBPMS monitors the stopping energy and amount of braking pressure applied to a vehicle. In doing so it can build up performance analytics and reports.\n\nWhat happens? \nThe reports replace traditional brake tests, reducing them from being required four times per year to just once per year. \n\nBenefits \n- More time on the road\n- Less downtime and fewer breakdowns\n- Improved vehicle and driver safety \n- Fully verified and approved by the Driver and Vehicle Standards Agency\n\n\nTYRE PRESSURE MONITORING SYSTEM (TPMS)\n\nDecrease downtime and increase MPG with real-time tyre performance updates\n\nWhat is it and how does it work? \nA sensor is installed in each tyre that measures pressure, temperature and location. This data is fed back to provide real-time performance updates.\n\nWhat happens? \nThe sensors alert the user to any issues as they occur. For example, an underinflated trailer tyre will give a yellow warning at 115 psi and red warning at 108 psi. \n\nBenefits\n- More time on the road\n- Save money on tyre recharges\n- Improved MPG \n\n\nDIAGNOSTIC TROUBLE CODES (DTC) \n\nFix trailer ECU faults without requiring roadside assistance\n\nWhat is it and how does it work? \nDTC actively monitors red and amber ABS warning lights on the dashboard of HGVs, to identify system errors and suggest self-repair fixes. The technology is already successfully used on Haldex Trailers.\n\nWhat happens? \nVehicle performance is checked at all stages of its journey, so faults can be highlighted, along with solutions to address the issue. As a high number of faults are caused by the EBS Suzie Cable or Connector, the information provided often includes self-repair recommendations, meaning the problem can be solved without the need for an engineer.\n\nBenefits\nFault codes are easily diagnosed without requiring roadside assistance. This allows for quick fixes, less downtime and cost savings.\n\n\nTELEMATICS TRACKING\n\nActively monitor the location and performance of your vehicles and drivers\n\nWhat is it and how does it work? \nUsing tools including tracking systems, geozone reporting, trip history and speed analysis, telematics tracks data to improve productivity and operational efficiency.\n\nWhat happens? \nTelematics transmits data such as speed, location, time, driver information and vehicle identification. This provides a number of insights and outputs, including the real-time location of vehicles, speeding alerts, time on the road v time in depot, maintenance reminders, vehicle weight reporting and average response time.\n \nBenefits\n- Live tracking\n- More efficient vehicle and driver planning\n- Interactive safety alerts\n- Reduced business costs\n\n\n\nFor friendly, expert advice contact: \n\n0330 124 5651 \ninfo@hireco.co.uk \nhireco.co.uk \n',
		CTA: '',
		'Image/Videos': '',
		'Comments (Not extracted)': ''
	},
	{
		Category: 'Support',
		Title: 'Support',
		Subtitle: 'Fleet Maintenance',
		Description:
			"Our fleet maintenance offering is second to none, from the smart technology we employ to the first class engineers we deploy. Our digital transport solution gives you a 360 degree, preventative support network, which doesn't wait for your fleet to be in trouble before answering your call, it monitors it and pro-actively makes a call to help prevent those small issues becoming big problems. But when you do need us to react quickly and around the clock you can count on us with our 24/7 smart portal and 24/7 response and breakdown cover. full 24/7 tyre management, quick, efficient and quality repairs by engineering experts, all industry complaint to DVSA standards,    Basically we deliver for you, maximum uptime, all of the time.",
		CTA: 'Talk to our Fleet Maintenance expert today: Tim Attwood',
		'Image/Videos': '',
		'Comments (Not extracted)': 'Fleet maintenance Belfast trip footage to edit and use here... w/c 1.6.'
	},
	{
		Category: 'Case Studies ',
		Title: '',
		Subtitle: '',
		Description: '',
		CTA: '',
		'Image/Videos': 'CASE STUDIES',
		'Comments (Not extracted)': "Case studies link to it's own page should be on every page as an option to view... showcasing 3-4 case studies - video and still/copy"
	}
]

export const appState = create(
	devtools(set => ({
		// States
		started: false,
		activeSlide: 0,
		// activeRing: 'pageSection',
		activeRing: 'ring_2',
		// activeRing: 'none',
		focusRing: 'none',
		numPages: 4,
		activePage: null,
		activePageNumber: null,
		// currentView: 'main',
		currentView: 'page',
		isAnimating: false,
		universeStores: null,
		cameraRefInfo: null,
		activeCameraAnchor: null,
		cameraOrbitPoints: generateCirclePoints(1.1, 7, 0.6),
		returnCameraToOrigin: null,
		forcePageUpdate: false,
		cameraControlsMouseButtons: { left: 1, middle: 8, right: 2, wheel: 8 },
		dimensions: { width: window.innerWidth, height: window.innerHeight },
		scrollControlsInitiated: false,
		activeTile: null,
		activeTileInfo: null,
		cameraControlsref: null,
		activeTileRef: null,
		focusElementRef: null,
		updateBounds: null,

		// Set States
		setActiveSlide: index => set(state => ({ activeSlide: index })),
		setActiveRing: index => set(state => ({ activeRing: index })),
		setFocusRing: index => set(state => ({ focusRing: index })),
		setNumPages: index => set(state => ({ numPages: index })),
		setActivePage: index => set(state => ({ activePage: index })),
		setActivePageNumber: index => set(state => ({ activePageNumber: index })),
		setCurrentView: index => set(state => ({ currentView: index })),
		setIsAnimating: input => set(state => ({ isAnimating: input })),
		setStarted: input => set(state => ({ started: input })),
		setUniverseStores: input => set(state => ({ universeStores: input })),
		setCameraRefInfo: input => set(state => ({ cameraRefInfo: input })),
		setActiveCameraAnchor: input => set(state => ({ activeCameraAnchor: input })),
		setCameraOrbitPoints: input => set(state => ({ cameraOrbitPoints: input })),
		setReturnCameraToOrigin: input => set(state => ({ returnCameraToOrigin: input })),
		setForcePageUpdate: input => set(state => ({ forcePageUpdate: input })),
		setCameraControlsMouseButtons: input => set(state => ({ cameraControlsMouseButtons: input })),
		setDimensions: input => set(state => ({ dimensions: input })),
		setScrollControlsInitiated: input => set(state => ({ scrollControlsInitiated: input })),
		setActiveTile: input => set(state => ({ activeTile: input })),
		setCameraControlsref: input => set(state => ({ cameraControlsref: input })),
		setActiveTileInfo: input => set(state => ({ activeTileInfo: input })),
		setActiveTileRef: input => set(state => ({ activeTileRef: input })),
		setFocusElementRef: input => set(state => ({ focusElementRef: input })),
		setUpdateBounds: input => set(state => ({ updateBounds: input })),

		// Content
		ringNames: ringNames,
		sectionContent: input => pageCopy.filter(a => a.Category == input),
		sectionCopy: input => sectionCopy[input],
		allContent: pageCopy,
		getContentByTitle: input => pageCopy.filter(a => a.Title === input),

		// functions
		generateCirclePoints: (radius, segments, yElevation) => generateCirclePoints(radius, segments, yElevation),
		getUniverseStores: () => getUniverseStores()
	}))
)

// const cameraPositionsStore = {}

function generateCirclePoints(radius, segments, yElevation = 0) {
	const points = []
	for (let i = 0; i < segments; i++) {
		const angle = (i / segments) * Math.PI * 2
		// let point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
		let point = new THREE.Vector3(Math.cos(angle) * radius, yElevation, Math.sin(angle) * radius)
		points.push(point)
	}
	return points
}

// Unvierse Stores from Zustand State Management
const getUniverseStores = () => {
	let colorValues = []
	let baseValues = [0.831, 0.25, 0.007]
	for (let i = 0; i < 15; i++) {
		let row = []
		row.push(baseValues[0] * i)
		row.push(baseValues[1] * i)
		row.push(baseValues[2] * i)
		colorValues.push(row)
	}
	const universeMultipliers = {}

	const fectchSectionPositions = () => {
		const { nodes, materials } = useGLTF('./models/hireco_3DScene_sectLocation-v1.glb')
		let sectPositions = {}
		Object.keys(nodes).forEach(a => {
			let b = nodes[a]
			if (b.type == 'Mesh') sectPositions[b.name] = b.position
		})
		return sectPositions
	}
	const sectionPositions = fectchSectionPositions()

	return { colorValues, universeMultipliers, sectionPositions }
}

useGLTF.preload('./models/hireco_3DScene_sectLocation-v1.glb')
