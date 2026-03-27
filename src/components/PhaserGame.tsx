import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
    scene: typeof Phaser.Scene | Phaser.Scene;
    config?: Partial<Phaser.Types.Core.GameConfig>;
    onGameCreated?: (game: Phaser.Game) => void;
    gameData?: any;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ scene, config, onGameCreated, gameData }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!parentRef.current) return;

        const defaultWidth = 800;
        const defaultHeight = 600;

        const gameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: parentRef.current,
            width: defaultWidth,
            height: defaultHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: scene,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            transparent: true,
            ...config
        };

        const game = new Phaser.Game(gameConfig);
        gameRef.current = game;

        // Store game data in registry for scene access
        if (gameData) {
            game.registry.set('gameData', gameData);
        }

        if (onGameCreated) {
            onGameCreated(game);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []); // Only run once on mount

    // Update game data if it changes
    useEffect(() => {
        if (gameRef.current && gameData) {
            gameRef.current.registry.set('gameData', gameData);
        }
    }, [gameData]);

    return (
        <div 
            ref={parentRef} 
            className="w-full h-full rounded-[32px] overflow-hidden shadow-4xl border-8 border-white bg-gray-900" 
            style={{ width: '800px', height: '600px' }}
        />
    );
};

export default PhaserGame;
