import React, { ReactElement } from 'react';
// import Lottie from 'react-lottie';
import { AnimatePresence, motion } from 'framer-motion';
import animation from './animation.json';
import { LoadingContainer } from './styles';

interface LoadingProps {
  isLoading: boolean;
}
const Loading = ({ isLoading }: LoadingProps): ReactElement => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
    { isLoading && <motion.div>
      <AnimatePresence>
        <LoadingContainer>
          {/* <Lottie options={defaultOptions} height={250} width={250} /> */}
        </LoadingContainer>
      </AnimatePresence>
    </motion.div>
    }
    </>
  );
}

export default Loading;