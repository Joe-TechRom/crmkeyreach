// Enhanced scroll progress component
const ScrollProgress = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="3px"
      zIndex={100}
      style={{
        transform: 'none',
        willChange: 'transform'
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        style={{
          transformOrigin: '0%',
          background: 'var(--chakra-colors-primary-500)'
        }}
      />
    </Box>
  )
}
