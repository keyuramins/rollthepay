export function MissionSection() {
  return (
    <section className="home-mission-section">
      <div className="home-mission-section__container">
        <div className="home-mission-section__header">
          <h2 className="home-mission-section__title">
            Our Mission
          </h2>
          <p className="home-mission-section__description">
            We make it easier to find information on salaries of specific jobs, providing reliable access to accurate data so everyone can get more out of their career.
          </p>
        </div>
        
        <div className="home-mission-section__grid">
          <div className="home-mission-section__column">
            <h3 className="home-mission-section__column-title">
              How Much Should You Earn?
            </h3>
            <p className="home-mission-section__column-description">
              Many people are interested in knowing how much they should be paid for their job. Because this varies so widely depending on many factors, simply asking can be difficult.
            </p>
            <p className="home-mission-section__column-description">
              RollThePay offers you a way to find this information without asking. All of this is available by simply browsing our website, with data specific to particular countries and salary ranges.
            </p>
          </div>
          
          <div className="home-mission-section__column">
            <h3 className="home-mission-section__column-title">
              Find Your Average Salary
            </h3>
            <p className="home-mission-section__column-description">
              We have already published over a million salaries from thousands of employers around the globe. Data isn't always easy to find, so we have made it our mission to compile as much information as possible.
            </p>
            <p className="home-mission-section__column-description">
              This is an excellent opportunity for people who want to learn about the average salary of a particular profession but aren't sure how to do so.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
