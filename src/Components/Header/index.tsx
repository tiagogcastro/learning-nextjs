import Link from 'next/link';
import { SignInGithubButton } from '../SignInGithubButton';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="" />
        <nav>
        {/* className={styles.active} */}
          <Link href="/" >Home</Link>
          <Link href="/posts">Posts</Link>
        </nav>
        <SignInGithubButton />
      </div>
    </header>
  );
}