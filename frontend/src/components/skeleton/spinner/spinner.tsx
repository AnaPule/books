import styles from './spinner.module.css';

interface SpinnerProps{
    loadingLabel?: string;
    colour?: String;
}

export default function Spinner({
    loadingLabel,
    colour
}:SpinnerProps) {
    return (
        <section className="bg-transparent flex items-center gap-4 justify-center font-sans">
            <div 
            style={{background: `${colour ? colour : '#7b5f48'}`}}
            className={`${styles.loader}`}>
            </div>{loadingLabel ? loadingLabel : ""}...
        </section>
    );
}
