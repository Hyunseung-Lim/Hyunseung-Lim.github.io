import { OffRecordLayout } from '../OffRecordLayout';
import './movie.css';

const MOVIE_YEARS = [
  {
    year: '2025',
    label: 'Best Motion Picture',
    nominees: [
      {
        title: 'No Other Choice',
        image: '/movies/2025/no_other_choice.png'
      },
      {
        title: 'One Battle After Another',
        image: '/movies/2025/one_battle_after_another.png'
      },
      {
        title: 'The World of Love',
        image: '/movies/2025/the_world_of_love.png'
      }
    ]
  },
  {
    year: '2024',
    label: 'Best Motion Picture',
    nominees: [
      {
        title: 'Anatomy of a Fall',
        image: '/movies/2024/anatomy_of_a_fall.png'
      },
      {
        title: 'Look Back',
        image: '/movies/2024/look_back.png'
      },
      {
        title: 'The Zone of Interest',
        image: '/movies/2024/the_zone_of_interest.png'
      }
    ]
  },
  {
    year: '2023',
    label: 'Best Motion Picture',
    nominees: [
      {
        title: 'Monster',
        image: '/movies/2023/monster.png'
      },
      {
        title: 'Oppenheimer',
        image: '/movies/2023/oppenheimer.png'
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        image: '/movies/2023/spider-man_across_the_spider_verse.png'
      }
    ]
  },
  {
    year: '2022',
    label: 'Best Motion Picture',
    nominees: [
      {
        title: 'Decision to Leave',
        image: '/movies/2022/decision_to_leave.png'
      },
      {
        title: 'Everything Everywhere All at Once',
        image: '/movies/2022/everything_everywhere_all_at_once.png'
      },
      {
        title: 'The Worst Person in the World',
        image: '/movies/2022/the_worst_person_in_the_world.png'
      }
    ]
  }
];

export const MovieOffRecord = () => (
  <OffRecordLayout
    pageId="movie"
    title="MOVIE"
    subtitle={(
      <>
        <a
          className="movie-subtitle-link"
          href="https://pedia.watcha.com/ko-KR/users/OkexJPw7rKvdb"
          target="_blank"
          rel="noreferrer"
        >
          Hyunseung
        </a>
        's Movie of the Year
      </>
    )}
    sectionCount={MOVIE_YEARS.length}
  >
    {(fadeInRef) =>
      MOVIE_YEARS.map((year) => (
        <section className="project-section off-record-movie-section" key={year.year}>
          <div className="off-record-placeholder-heading project-fade-block" ref={fadeInRef}>
            <p className="off-record-placeholder-title">{year.label}</p>
            <p className="off-record-placeholder-year">{year.year}</p>
          </div>
          <div className="off-record-movie-row">
            {year.nominees.map((nominee) => (
              <article className="off-record-movie-card project-fade-block" ref={fadeInRef} key={nominee.title}>
                <div className="off-record-movie-poster">
                  <img src={nominee.image} alt={`${nominee.title} poster`} loading="lazy" />
                </div>
                <p className="off-record-movie-title">{nominee.title}</p>
              </article>
            ))}
          </div>
        </section>
      ))
    }
  </OffRecordLayout>
);
