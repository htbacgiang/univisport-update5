// components/tantruonggiang/ProjectCard.js
import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project, onQuoteClick }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.imageContainer}>
        <Image
          src={project.image}
          alt={`Hình ảnh chính của ${project.title}`}
          fill={true}
          style={{ objectFit: "cover" }}
          className={styles.projectImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className={styles.hoverOverlay}>
          <Link href={`/feedback/${project.slug}`}>
            <button className={styles.detailButton}>
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;