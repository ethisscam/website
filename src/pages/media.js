import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import theMeta from '../js/helpers.js'

class RootIndex extends React.Component {
	constructor() {
		super();
		var cat = get(this, 'props.data.allContentfulMediaCategory.edges');
		console.log(cat)
		this.state = {
			mediaFilter: {
				value: '',
				key: Math.random()
			}
		}
		//this.someName = this.someName.bind(this);
	}
	categoryChange = (cat, e = null) => {
		if(e) e.preventDefault();
		this.setState({
			mediaFilter: {
				value: cat,
				key: Math.random()
			}
		});
	}
	render() {
		var siteTitle = "Kleros";
		var media = get(this, 'props.data.allContentfulMediaEntry.edges');
		var data = get(this, 'props.data.allContentfulMediaPage.edges')[0].node;
		var cats = get(this, 'props.data.allContentfulMediaCategory.edges');
		if(this.state.mediaFilter.value == '') this.categoryChange(cats[0].node.title.title);
		else media = media.filter(({node}) => (node.category.map((el, num) => (el.title.title)).indexOf(this.state.mediaFilter.value) > -1 ));
		return (
			<div>
				<Helmet><html lang="en" /><title>{siteTitle}</title></Helmet>
					<section className="ca_juror_top ca_media_top">
						<div className="container">
							<div className="row">
								<div className="col-12 col-md-7">
									<h1>{theMeta(data.topBlock, 'Media > Top > Title').data.data}</h1>
									<h6>{theMeta(data.topBlock, 'Media > Top > Sub Title').data.data}</h6>
								</div>
								<div className="col-12 col-md-5"></div>
							</div>
						</div>
					</section>
					<section className="ca_media_content ca_wave_bottom_inverted">
						<div className="container">
							<div className="row">
								<div className="col-12 col-md-3">
									<h3>Categories</h3>
									<ul>
										{cats.map((el, num) => {
											return <li key={num}><a href="#" className={el.node.title.title === this.state.mediaFilter.value ? "ca_selected" : ""} onClick={(e) => this.categoryChange(el.node.title.title, e)}>{el.node.title.title}</a></li>
										})}
									</ul>
								</div>
								<div className="col-12 col-md-9">
									<div className="row">
										{media.map((el, num) => {
											return (
												<div key={num} className="col-12 col-md-4">
													<div className="ca_img">
														<img src={el.node.image === null ? "/img/media/photo.png" : el.node.image.file.url} alt="Kleros" />
													</div>
													<div className="ca_txt">
														<div className="ca_date">{new Date(el.node.date).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</div>
														<p>{el.node.title.title.split(" ").splice(0,20).join(" ")}</p>
														<a target="_blank" href={el.node.link}>{el.node.linkText}</a>
													</div>
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="ca_media_cta">
						<div className="container">
							<div className="row">
								<div className="col-12 col-md-1"></div>
								<div className="col-12 col-md-10">
									<h2 className="ca_underlined">{theMeta(data.bottomBlock, 'Media > Bottom > CTA Title').data.data}</h2>
									<h6>{theMeta(data.bottomBlock, 'Media > Bottom > CTA Text').data.data}</h6>
									<a target={"_" + theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Left').referenceData[0].target} href={theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Left').referenceData[0].url} className="ca_button ca_solid_blue">{theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Left').referenceData[0].text.text}</a>
									<a target={"_" + theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Right').referenceData[0].target} href={theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Right').referenceData[0].url} className="ca_button ca_transparent_blue">{theMeta(data.bottomBlock, 'Media > Bottom > Buttons > Right').referenceData[0].text.text}</a>
								</div>
								<div className="col-12 col-md-1"></div>
							</div>
						</div>
					</section>
			</div>
		)
	}
}

export default RootIndex

export const pageQuery = graphql`
	query MediaQuery {
		allContentfulMediaCategory(sort: {fields: [createdAt], order: ASC}) {
			edges {
				node {
					title {title}
				}
			}
		}
		allContentfulMediaEntry(sort: {fields: [date, title___NODE], order: DESC}) {
			edges {
				node {
					title {title}
					date
					link
					linkText
					image {file{url}}
					category {
						title {title}
					}
				}
			}
		}
		allContentfulMediaPage(sort: {fields: [id], order: DESC}) {
			edges {
				node {
					topBlock {
						title
						data {data childMarkdownRemark {html}}
						mediaData {file{url}}
						referenceData {
							__typename
							... on Node {
								... on ContentfulLink {
									text {text}
									url
									extraClass
									target
								}
								... on ContentfulHomepageHowSteps {
									title {title}
									text {text}
									image {file{url}}
								}
							}
						}
					}
					bottomBlock {
						title
						data {data childMarkdownRemark {html}}
						mediaData {file{url}}
						referenceData {
							__typename
							... on Node {
								... on ContentfulLink {
									text {text}
									url
									extraClass
									target
								}
								... on ContentfulHomepageHowSteps {
									title {title}
									text {text}
									image {file{url}}
								}
							}
						}
					}
				}
			}
		}
	}
`
