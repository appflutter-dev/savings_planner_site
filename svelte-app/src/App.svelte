<script>
  import "./styles/global.css";
  import Header from "./components/Header.svelte";
  import Downloads from "./components/Downloads.svelte";
  import Legal from "./components/Legal.svelte";
  import PrivacyPolicy from "./components/PrivacyPolicy.svelte";
  import GdprNotice from "./components/GdprNotice.svelte";
</script>

<Header />
<main>
  <section class="about">
    <h2>Savings Planner</h2>
    <div class="short-description">
      <h3>
        Manage and optimize your wealth with our mobile investment planning app.
      </h3>
    </div>
    <div class="detailed-description">
      <p>
        Discover our mobile investment planning application, an essential tool
        for managing and optimizing your wealth. With this application, you can
        define different investment accounts, each with its initial amount and
        performance. You have the ability to plan the distribution of your
        monthly savings across these accounts, allowing you to diversify your
        investments and minimize risks.
      </p>
      <p>
        But that’s not all, our application also offers a multi-year projection
        feature. This allows you to evaluate your future wealth and make
        informed decisions. Start planning your financial future today with our
        investment planning application.
      </p>
    </div>
    <div class="detailed-description">
      <p>
        Introducing our mobile investment planning application, an essential
        tool for anyone looking to manage and optimize their wealth in an
        efficient and intuitive manner. This application has been designed with
        the user in mind, offering a user-friendly interface that is easy to
        navigate.
      </p>
      <p>
        With this application, you can define different investment accounts,
        each with its initial amount and performance. This gives you a clear
        overview of your investments and allows you to track their progress over
        time. You can also add new accounts at any time, offering you the
        flexibility needed to adapt your portfolio to your changing financial
        goals.
      </p>
      <p>
        One of the key features of our application is the ability to plan the
        distribution of your monthly savings across these accounts. This means
        you can decide how much you want to invest in each account each month,
        allowing you to diversify your investments and minimize risks. This
        feature is particularly useful for those looking to balance their
        portfolio and avoid putting all their eggs in one basket.
      </p>
      <p>
        But that’s not all, our application also offers a multi-year projection
        feature. This allows you to evaluate your future wealth based on your
        current investments and your monthly savings plan. You can see how your
        wealth could evolve over time, giving you a clear idea of what you can
        expect in the future. This feature can be a valuable tool for long-term
        planning and can help you make informed decisions on how to manage your
        money.
      </p>
      <p>
        Start planning your financial future today with our investment planning
        application. Download it now and take control of your financial future.
      </p>
    </div>
    <div class="features">
      <h3>Features</h3>
      <ul>
        <li>
          Definition of different investment accounts with initial amount and
          performance.
        </li>
        <li>
          Planning of the distribution of monthly savings across different
          accounts.
        </li>
        <li>Diversification of investments to minimize risks.</li>
        <li>Multi-year projection feature to evaluate future wealth.</li>
        <li>User-friendly and easy-to-navigate interface.</li>
      </ul>
    </div>
  </section>
  <Downloads />
  <PrivacyPolicy />
  <GdprNotice />
  <Legal />
</main>

<style>
  .about {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .about h2 {
    text-align: center;
    color: #4caf50;
    margin-bottom: 1rem;
  }

  .short-description {
    text-align: center;
    margin-bottom: 2rem;
  }

  .short-description h3 {
    color: #333;
    font-size: 1.25rem;
  }

  .detailed-description {
    margin-bottom: 2rem;
  }

  .detailed-description p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .features {
    margin-top: 2rem;
  }

  .features h3 {
    color: #4caf50;
    margin-bottom: 1rem;
  }

  .features ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  .features li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
</style>
